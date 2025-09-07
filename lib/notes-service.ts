import { Client, Databases, Query } from 'appwrite';
import { client } from '../app/appwrite';
import { ID } from 'appwrite';

export const databases = new Databases(client);

// Database and Collection IDs - you'll need to create these in Appwrite Console
const DATABASE_ID = '68bd49ef00378a873aae';
const NOTES_COLLECTION_ID = 'notes';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  wordCount: number;
  userId: string;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
}

class NotesService {
  /**
   * Create a new note
   */
  async createNote(data: CreateNoteData, userId: string): Promise<Note> {
    const wordCount = (data.content || '').split(/\s+/).filter(word => word.length > 0).length;
    
    const noteData = {
      title: data.title,
      content: data.content || '',
      category: data.category || 'Personal',
      tags: data.tags || [],
      isFavorite: false,
      wordCount,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        ID.unique(),
        noteData
      );

      return {
        id: response.$id,
        title: response.title,
        content: response.content,
        category: response.category,
        tags: response.tags,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        isFavorite: response.isFavorite,
        wordCount: response.wordCount,
        userId: response.userId,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  /**
   * Get all notes for a specific user
   */
  async getUserNotes(userId: string): Promise<Note[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('updatedAt')
        ]
      );

      return response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        isFavorite: doc.isFavorite,
        wordCount: doc.wordCount,
        userId: doc.userId,
      }));
    } catch (error) {
      console.error('Error fetching user notes:', error);
      throw error;
    }
  }

  /**
   * Get a specific note by ID
   */
  async getNote(noteId: string): Promise<Note | null> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        noteId
      );

      return {
        id: response.$id,
        title: response.title,
        content: response.content,
        category: response.category,
        tags: response.tags,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        isFavorite: response.isFavorite,
        wordCount: response.wordCount,
        userId: response.userId,
      };
    } catch (error) {
      console.error('Error fetching note:', error);
      return null;
    }
  }

  /**
   * Update a note
   */
  async updateNote(noteId: string, data: UpdateNoteData): Promise<Note | null> {
    try {
      const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate word count if content is being updated
      if (data.content !== undefined) {
        updateData.wordCount = data.content.split(/\s+/).filter(word => word.length > 0).length;
      }

      const response = await databases.updateDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        noteId,
        updateData
      );

      return {
        id: response.$id,
        title: response.title,
        content: response.content,
        category: response.category,
        tags: response.tags,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        isFavorite: response.isFavorite,
        wordCount: response.wordCount,
        userId: response.userId,
      };
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        noteId
      );
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  /**
   * Search notes by title or content
   */
  async searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.or([
            Query.search('title', searchTerm),
            Query.search('content', searchTerm)
          ]),
          Query.orderDesc('updatedAt')
        ]
      );

      return response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        isFavorite: doc.isFavorite,
        wordCount: doc.wordCount,
        userId: doc.userId,
      }));
    } catch (error) {
      console.error('Error searching notes:', error);
      throw error;
    }
  }

  /**
   * Get favorite notes for a user
   */
  async getFavoriteNotes(userId: string): Promise<Note[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('isFavorite', true),
          Query.orderDesc('updatedAt')
        ]
      );

      return response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        content: doc.content,
        category: doc.category,
        tags: doc.tags,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        isFavorite: doc.isFavorite,
        wordCount: doc.wordCount,
        userId: doc.userId,
      }));
    } catch (error) {
      console.error('Error fetching favorite notes:', error);
      throw error;
    }
  }
}

export const notesService = new NotesService();
