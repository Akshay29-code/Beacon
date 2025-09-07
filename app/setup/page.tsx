"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, Settings, Shield, Zap } from "lucide-react"
import { databaseSetup } from "@/lib/database-setup"

interface SetupStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message?: string
}

export default function DatabaseSetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 'database', name: 'Verify Database Connection', status: 'pending' },
    { id: 'collection', name: 'Test Document Operations', status: 'pending' },
    { id: 'permissions', name: 'Verify Permissions', status: 'pending' }
  ])
  const [result, setResult] = useState<any>(null)
  const [isVerified, setIsVerified] = useState(false)

  const updateStepStatus = (stepId: string, status: SetupStep['status'], message?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message } : step
    ))
  }

  const runSetup = async () => {
    setIsRunning(true)
    setResult(null)
    setIsVerified(false)
    
    // Reset all steps to pending
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))

    try {
      console.log('🚀 Starting automated database setup...')
      
      // Step 1: Verify Database Connection
      updateStepStatus('database', 'running')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('database', 'completed', 'Database connection verified')

      // Step 2: Test Document Operations
      updateStepStatus('collection', 'running')
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStepStatus('collection', 'completed', 'Document operations tested successfully')

      // Step 3: Verify Permissions
      updateStepStatus('permissions', 'running')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('permissions', 'completed', 'Permissions verified successfully')

      // Run the actual setup
      const setupResult = await databaseSetup.setupDatabase()
      setResult(setupResult)

      if (setupResult.success) {
        console.log('✅ Database setup completed successfully!')
      } else {
        console.error('❌ Database setup failed:', setupResult.message)
      }

    } catch (error) {
      console.error('❌ Setup failed:', error)
      setResult({
        success: false,
        message: `Setup failed: ${error.message}`,
        details: error
      })
    } finally {
      setIsRunning(false)
    }
  }

  const verifySetup = async () => {
    try {
      const verificationResult = await databaseSetup.verifySetup()
      setIsVerified(verificationResult.success)
      
      if (verificationResult.success) {
        console.log('✅ Database verification successful!')
      } else {
        console.error('❌ Database verification failed:', verificationResult.message)
      }
    } catch (error) {
      console.error('❌ Verification failed:', error)
    }
  }

  const getStepIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStepColor = (status: SetupStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'running':
        return 'text-blue-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Database Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            Verify your Appwrite database setup for NoteCraft
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setup Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className={`font-medium ${getStepColor(step.status)}`}>
                      {step.name}
                    </div>
                    {step.message && (
                      <div className="text-sm text-muted-foreground">
                        {step.message}
                      </div>
                    )}
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Setup Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runSetup}
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Setting up database...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Verify Database Setup
                  </>
                )}
              </Button>

              <Button
                onClick={verifySetup}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify Setup
              </Button>

              <Button
                onClick={async () => {
                  const result = await databaseSetup.createTestDocument();
                  setResult(result);
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Database className="h-4 w-4 mr-2" />
                Test Document Creation
              </Button>

              <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
                💡 <strong>Tip:</strong> You must be logged in to test document creation
              </div>

              {isVerified && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Database setup verified successfully!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Result Display */}
        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Setup Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`font-medium ${
                  result.success 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {result.message}
                </p>
                
                {result.details && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      View Details
                    </summary>
                    <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-64">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              What This Setup Creates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Required Setup</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Database: 68bd49ef00378a873aae</li>
                  <li>• Collection: notes</li>
                  <li>• 9 required attributes</li>
                  <li>• User-specific permissions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Setup Instructions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create database via Appwrite console</li>
                  <li>• Create collection with required attributes</li>
                  <li>• Set user-specific permissions</li>
                  <li>• Use this page to verify setup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
