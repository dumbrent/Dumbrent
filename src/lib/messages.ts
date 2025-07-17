import { supabase } from './supabase';
import type { Message } from '../types';

export async function getMessages(userId: string): Promise<Message[]> {
  try {
    // Use the secure function instead of direct table query
    const { data, error } = await supabase.rpc('get_my_messages');

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    // Transform the data to match the expected Message type
    return data?.map((message: any) => ({
      id: message.id,
      content: message.content,
      created_at: message.created_at,
      read_at: message.read_at,
      sender: message.sender,
      recipient: message.recipient,
      listing: message.listing
    })) || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    throw error;
  }
}

export async function sendMessage(
  recipientId: string,
  content: string,
  listingId?: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert({
      recipient_id: recipientId,
      content,
      listing_id: listingId,
      conversation_id: crypto.randomUUID() // Generate a conversation ID
    });

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}