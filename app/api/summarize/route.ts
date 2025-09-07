import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, maxLength = 200 } = await request.json()

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text must be at least 50 characters long' },
        { status: 400 }
      )
    }

    // Try Gemini API first
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY
      
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured')
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please provide a concise summary of the following text in approximately ${maxLength} characters or less. Focus on the main points and key information:\n\n${text}`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: maxLength,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const summary = data.candidates[0].content.parts[0].text.trim()
        return NextResponse.json({ summary })
      } else {
        throw new Error('Invalid response from Gemini API')
      }
    } catch (geminiError) {
      console.warn('Gemini API failed, falling back to extractive summarization:', geminiError)
      
      // Fallback to extractive summarization
      const sentences = text
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 10)
        .map(sentence => sentence.trim())

      if (sentences.length <= 3) {
        return NextResponse.json({ summary: text })
      }

      // Score sentences by word frequency and position
      const wordFreq: { [key: string]: number } = {}
      const words = text.toLowerCase().match(/\b\w+\b/g) || []
      
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      })

      const scoredSentences = sentences.map((sentence, index) => {
        const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || []
        const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0)
        
        // Boost score for sentences at the beginning
        const positionBoost = index < 3 ? 1.5 : 1
        
        return {
          sentence,
          score: score * positionBoost,
          index
        }
      })

      // Sort by score and take top sentences
      const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(3, Math.ceil(sentences.length / 3)))
        .sort((a, b) => a.index - b.index) // Maintain original order
        .map(item => item.sentence)

      const summary = topSentences.join('. ') + '.'
      
      return NextResponse.json({ summary })
    }
  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
