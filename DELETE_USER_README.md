# User Deletion Script

This script allows you to delete a user and all their related data from your Supabase database.

## Prerequisites

1. **Environment Variables**: You need to set up the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin access)

2. **Dependencies**: The script requires the `dotenv` package (already installed).

## Setup

1. Create a `.env` file in your project root with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" and "service_role" key

## Usage

### Method 1: Interactive Mode
```bash
node delete-user.js
```
The script will prompt you to enter the user ID and confirm the deletion.

### Method 2: Command Line Argument
```bash
node delete-user.js <user_id>
```
Replace `<user_id>` with the actual user ID you want to delete.

## What Gets Deleted

The script will delete the following data associated with the user:
- User applications
- Saved listings
- Listing subscriptions
- User's own listings
- Neighborhood highlights
- Messages (sent and received)
- User authentication record

## Safety Features

- **Confirmation Prompt**: The script asks for confirmation before deletion
- **User Verification**: Checks if the user exists before attempting deletion
- **Error Handling**: Provides detailed error messages if something goes wrong
- **Foreign Key Handling**: Deletes related data in the correct order to avoid constraint violations

## Example Output

```
🗑️  Supabase User Deletion Tool
================================

Enter the user ID to delete: 12345678-1234-1234-1234-123456789012

⚠️  Are you sure you want to delete user 12345678-1234-1234-1234-123456789012? This action cannot be undone. (yes/no): yes

🗑️  Starting deletion process for user: 12345678-1234-1234-1234-123456789012
✅ User found: user@example.com

📋 Deleting related data...
✅ Applications deleted
✅ Saved listings deleted
✅ Listing subscriptions deleted
✅ User listings deleted
✅ Neighborhood highlights deleted
✅ Messages deleted

👤 Deleting user from authentication...
✅ User deleted successfully from authentication

🎉 User deletion completed successfully!
```

## Troubleshooting

### "Missing required environment variables" error
- Make sure your `.env` file exists and contains the required variables
- Check that the variable names are correct (case-sensitive)

### "User not found" error
- Verify the user ID is correct
- Make sure you're using the service role key (not the anon key)

### Permission errors
- Ensure you're using the service role key, not the anon key
- The service role key has admin privileges required for user deletion

## Security Note

⚠️ **Warning**: This script uses the service role key which has full admin access to your database. Keep this key secure and never commit it to version control. 