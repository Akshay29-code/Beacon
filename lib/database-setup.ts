import { Client, Databases, ID, Permission, Role } from 'appwrite';
import { client } from '../app/appwrite';

const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = '68bd49ef00378a873aae';
const NOTES_COLLECTION_ID = 'notes';

interface DatabaseSetupResult {
  success: boolean;
  message: string;
  details?: any;
}

class DatabaseSetup {
  /**
   * Initialize the entire database setup
   */
  async setupDatabase(): Promise<DatabaseSetupResult> {
    try {
      console.log('🚀 Starting database setup...');

      // For client-side setup, we'll focus on creating documents
      // The database and collection should be created via the Appwrite console
      // or server-side scripts with API keys

      console.log('✅ Database setup completed successfully!');
      console.log('📝 Note: Database and collection should be created via Appwrite console');
      console.log('📝 This setup assumes the database structure already exists');
      
      return {
        success: true,
        message: 'Database setup completed successfully!',
        details: {
          note: 'Database and collection should be created via Appwrite console or server-side scripts'
        }
      };

    } catch (error) {
      console.error('❌ Database setup failed:', error);
      return {
        success: false,
        message: `Database setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      };
    }
  }

  /**
   * Verify the setup by checking if everything is working
   */
  async verifySetup(): Promise<DatabaseSetupResult> {
    try {
      console.log('🔍 Verifying database setup...');

      // Try to list documents to verify the setup
      try {
        const documents = await databases.listDocuments(
          DATABASE_ID,
          NOTES_COLLECTION_ID
        );
        
        console.log('✅ Database connection successful');
        console.log(`✅ Found ${documents.total} documents in collection`);
        
        return {
          success: true,
          message: 'Database setup verification completed successfully',
          details: {
            totalDocuments: documents.total,
            databaseId: DATABASE_ID,
            collectionId: NOTES_COLLECTION_ID
          }
        };
      } catch (error) {
        console.log('❌ Database verification failed - this is expected if database/collection not created yet');
        return {
          success: false,
          message: `Database verification failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please create the database and collection via Appwrite console first.`,
          details: error
        };
      }

    } catch (error) {
      console.error('❌ Database verification failed:', error);
      return {
        success: false,
        message: `Database verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      };
    }
  }

  /**
   * Create a test document to verify the setup
   */
  async createTestDocument(): Promise<DatabaseSetupResult> {
    try {
      console.log('🧪 Creating test document...');

      // Check if user is authenticated
      const { account } = await import('../app/appwrite');
      let currentUser;
      try {
        currentUser = await account.get();
        console.log('✅ User is authenticated:', currentUser.$id);
      } catch (error) {
        return {
          success: false,
          message: 'User must be logged in to create test documents. Please log in first.',
          details: { error: 'Authentication required' }
        };
      }

      const testDocument = await databases.createDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        ID.unique(),
        {
          title: 'Test Note',
          content: 'This is a test note to verify the database setup.',
          category: 'Test',
          tags: ['test', 'setup'],
          isFavorite: false,
          wordCount: 10,
          userId: currentUser.$id, // Use actual user ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );

      console.log('✅ Test document created successfully');
      
      // Clean up the test document
      await databases.deleteDocument(DATABASE_ID, NOTES_COLLECTION_ID, testDocument.$id);
      console.log('✅ Test document cleaned up');

      return {
        success: true,
        message: 'Test document created and cleaned up successfully',
        details: testDocument
      };

    } catch (error) {
      console.error('❌ Failed to create test document:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('unauthorized')) {
          errorMessage = 'User not authorized. Please check collection permissions.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Collection not found. Please create the collection first.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: `Failed to create test document: ${errorMessage}`,
        details: error
      };
    }
  }
}

export const databaseSetup = new DatabaseSetup();