import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env file or environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to prompt user for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to delete user and related data
async function deleteUser(userId) {
  try {
    console.log(`\n🗑️  Starting deletion process for user: ${userId}`);
    
    // First, let's check if the user exists
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user.user) {
      console.error(`❌ User not found: ${userId}`);
      return false;
    }
    
    console.log(`✅ User found: ${user.user.email}`);
    
    // Delete related data first (foreign key constraints)
    console.log('\n📋 Deleting related data...');
    
    // Delete applications
    const { error: applicationsError } = await supabase
      .from('applications')
      .delete()
      .eq('user_id', userId);
    
    if (applicationsError) {
      console.error('❌ Error deleting applications:', applicationsError.message);
    } else {
      console.log('✅ Applications deleted');
    }
    
    // Delete saved listings
    const { error: savedListingsError } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', userId);
    
    if (savedListingsError) {
      console.error('❌ Error deleting saved listings:', savedListingsError.message);
    } else {
      console.log('✅ Saved listings deleted');
    }
    
    // Delete listing subscriptions
    const { error: subscriptionsError } = await supabase
      .from('listing_subscriptions')
      .delete()
      .eq('owner_id', userId);
    
    if (subscriptionsError) {
      console.error('❌ Error deleting subscriptions:', subscriptionsError.message);
    } else {
      console.log('✅ Listing subscriptions deleted');
    }
    
    // Delete listings owned by the user
    const { error: listingsError } = await supabase
      .from('listings')
      .delete()
      .eq('landlord_id', userId);
    
    if (listingsError) {
      console.error('❌ Error deleting listings:', listingsError.message);
    } else {
      console.log('✅ User listings deleted');
    }
    
    // Delete neighborhood highlights
    const { error: highlightsError } = await supabase
      .from('neighborhood_highlights')
      .delete()
      .eq('user_id', userId);
    
    if (highlightsError) {
      console.error('❌ Error deleting neighborhood highlights:', highlightsError.message);
    } else {
      console.log('✅ Neighborhood highlights deleted');
    }
    
    // Delete messages
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    
    if (messagesError) {
      console.error('❌ Error deleting messages:', messagesError.message);
    } else {
      console.log('✅ Messages deleted');
    }
    
    // Finally, delete the user from auth
    console.log('\n👤 Deleting user from authentication...');
    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteUserError) {
      console.error('❌ Error deleting user:', deleteUserError.message);
      return false;
    }
    
    console.log('✅ User deleted successfully from authentication');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🗑️  Supabase User Deletion Tool');
  console.log('================================\n');
  
  try {
    // Get user ID from command line argument or prompt
    let userId = process.argv[2];
    
    if (!userId) {
      const inputUserId = await askQuestion('Enter the user ID to delete: ');
      if (!inputUserId.trim()) {
        console.log('❌ No user ID provided. Exiting...');
        rl.close();
        return;
      }
      userId = inputUserId.trim();
    }
    
    // Confirm deletion
    const confirm = await askQuestion(`\n⚠️  Are you sure you want to delete user ${userId}? This action cannot be undone. (yes/no): `);
    
    if (!['yes', 'y'].includes(confirm.toLowerCase().trim())) {
      console.log('❌ Deletion cancelled.');
      rl.close();
      return;
    }
    
    // Perform deletion
    const success = await deleteUser(userId);
    
    if (success) {
      console.log('\n🎉 User deletion completed successfully!');
    } else {
      console.log('\n❌ User deletion failed. Please check the error messages above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Script error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main(); 