# Appwrite Database Setup Guide

This guide will help you set up the Appwrite database for the NoteCraft application.

## 1. Create Database

1. Go to your Appwrite Console (https://cloud.appwrite.io)
2. Navigate to **Databases** in the left sidebar
3. Click **Create Database**
4. Set the database name: `notes_database`
5. Set the database ID: `notes_database` (this should match the DATABASE_ID in the code)

## 2. Create Notes Collection

1. Inside the `notes_database`, click **Create Collection**
2. Set the collection name: `Notes`
3. Set the collection ID: `notes` (this should match the NOTES_COLLECTION_ID in the code)
4. Click **Create Collection**

## 3. Configure Collection Attributes

Add the following attributes to the `notes` collection:

### Required Attributes:

1. **title** (String, 255 characters, Required)
   - Attribute ID: `title`
   - Size: 255
   - Required: Yes

2. **content** (String, 10000 characters, Required)
   - Attribute ID: `content`
   - Size: 10000
   - Required: Yes

3. **category** (String, 100 characters, Required)
   - Attribute ID: `category`
   - Size: 100
   - Required: Yes

4. **tags** (String[], Required)
   - Attribute ID: `tags`
   - Required: Yes

5. **isFavorite** (Boolean, Required)
   - Attribute ID: `isFavorite`
   - Required: Yes

6. **wordCount** (Integer, Required)
   - Attribute ID: `wordCount`
   - Required: Yes

7. **userId** (String, 255 characters, Required)
   - Attribute ID: `userId`
   - Size: 255
   - Required: Yes

8. **createdAt** (String, 255 characters, Required)
   - Attribute ID: `createdAt`
   - Size: 255
   - Required: Yes

9. **updatedAt** (String, 255 characters, Required)
   - Attribute ID: `updatedAt`
   - Size: 255
   - Required: Yes

## 4. Set Collection Permissions

### Read Permissions:
- **Users**: `read("user:{userId}")` - Users can only read their own notes

### Create Permissions:
- **Users**: `create("user:{userId}")` - Users can create notes for themselves

### Update Permissions:
- **Users**: `update("user:{userId}")` - Users can update their own notes

### Delete Permissions:
- **Users**: `delete("user:{userId}")` - Users can delete their own notes

## 5. Create Indexes (Optional but Recommended)

Create the following indexes for better performance:

1. **userId_index**
   - Type: Key
   - Attributes: `userId`
   - Orders: ASC

2. **updatedAt_index**
   - Type: Key
   - Attributes: `updatedAt`
   - Orders: DESC

3. **isFavorite_index**
   - Type: Key
   - Attributes: `isFavorite`
   - Orders: ASC

## 6. Update Environment Variables

Make sure your project ID in `app/appwrite.js` matches your Appwrite project:

```javascript
.setProject('YOUR_PROJECT_ID') // Replace with your actual project ID
```

## 7. Test the Setup

1. Start your application
2. Create a new account or log in
3. Try creating a new note
4. Verify that notes are saved to the database
5. Check that notes are user-specific (different users see different notes)

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure the collection permissions are set correctly
2. **Attribute Not Found**: Verify all required attributes are created
3. **Database Not Found**: Check that the database and collection IDs match the code
4. **User ID Mismatch**: Ensure the userId attribute is properly set when creating notes

### Debug Steps:

1. Check the browser console for error messages
2. Verify your Appwrite project ID is correct
3. Check the collection permissions in Appwrite Console
4. Ensure all required attributes are created

## Security Notes

- The current setup ensures users can only access their own notes
- All database operations are authenticated through Appwrite
- User IDs are automatically validated by Appwrite's permission system

## Next Steps

After setting up the database:

1. Test creating, editing, and deleting notes
2. Verify that notes persist across browser sessions
3. Test with multiple user accounts
4. Consider adding additional features like note sharing or categories

For more information, refer to the [Appwrite Documentation](https://appwrite.io/docs).
