# Database Setup Guide - Updated Approach

## 🎯 **New Simplified Approach**

Due to Appwrite SDK limitations in client-side environments, the database setup has been simplified to focus on **verification and testing** rather than automatic creation.

## 📋 **What You Need to Do**

### 1. Create Database via Appwrite Console
1. Go to your [Appwrite Console](https://cloud.appwrite.io)
2. Navigate to **Databases**
3. Click **Create Database**
4. Set Database ID: `notes_database`
5. Set Database Name: `Notes Database`

### 2. Create Collection
1. Inside the `notes_database`, click **Create Collection**
2. Set Collection ID: `notes`
3. Set Collection Name: `Notes`
4. Set Collection Type: `documents`

### 3. Add Required Attributes
Add these attributes to the `notes` collection:

| Attribute ID | Type | Size | Required | Array |
|-------------|------|------|----------|-------|
| `title` | String | 255 | Yes | No |
| `content` | String | 10000 | Yes | No |
| `category` | String | 100 | Yes | No |
| `tags` | String | 100 | Yes | Yes |
| `isFavorite` | Boolean | - | Yes | No |
| `wordCount` | Integer | - | Yes | No |
| `userId` | String | 255 | Yes | No |
| `createdAt` | String | 255 | Yes | No |
| `updatedAt` | String | 255 | Yes | No |

### 4. Set Permissions
Configure these permissions for the `notes` collection:

- **Read**: `read("user:{userId}")`
- **Create**: `create("user:{userId}")`
- **Update**: `update("user:{userId}")`
- **Delete**: `delete("user:{userId}")`

## 🧪 **Verification**

### Option 1: Web Interface
1. Start your app: `npm run dev`
2. Go to: `http://localhost:3000/setup`
3. Click **"Verify Database Setup"**
4. Click **"Test Document Creation"** to test CRUD operations

### Option 2: Manual Testing
1. Create a user account
2. Try creating a note
3. Verify notes are saved and retrieved correctly

## 🔧 **Troubleshooting**

### Common Issues

**"Collection not found"**
- Make sure the collection ID is exactly `notes`
- Verify the database ID is exactly `notes_database`

**"Permission denied"**
- Check that permissions are set correctly
- Ensure user authentication is working

**"Attribute not found"**
- Verify all 9 attributes are created
- Check attribute names match exactly

### Quick Fixes

1. **Double-check IDs**: Database and collection IDs must match exactly
2. **Verify permissions**: Users need read/write/delete access
3. **Check attributes**: All 9 attributes must be created
4. **Test authentication**: Make sure users can log in

## ✅ **Success Indicators**

You'll know the setup is working when:
- ✅ Database verification passes
- ✅ Test document creation succeeds
- ✅ Users can create/edit/delete notes
- ✅ Notes persist between sessions
- ✅ Each user sees only their own notes

## 🚀 **Next Steps**

After successful setup:
1. **Test the app**: Create accounts and notes
2. **Verify isolation**: Different users see different notes
3. **Check persistence**: Notes survive browser refreshes
4. **Enjoy**: Your NoteCraft app is ready!

---

**Note**: This approach focuses on verification rather than automatic creation, which is more reliable and gives you better control over your database setup.
