import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');

  // Load messages when component mounts
  useEffect(() => {
    console.log('Setting up Guestbook listeners');
    fetchMessages();
    
    // Set up auth state listener with explicit event handling
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, !!session);
      fetchMessages();
    });

    // Set up real-time subscription
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'messages' },
          (payload) => {
            console.log('Received real-time update:', payload);
            if (payload.new.status === 'approved') {
              setMessages(messages => [payload.new, ...messages]);
            }
          }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Guestbook listeners');
      subscription.unsubscribe();
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  async function fetchMessages() {
    console.log('Fetching messages...');
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      console.log('Successfully fetched messages:', data?.length);
      setMessages(data);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !name.trim()) return;
    
    const message = {
      name: name,
      content: newMessage,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    
    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error inserting message:', error);
    } else {
      setNewMessage('');
      setName('');
      alert('Thank you! Your message will be visible after approval.');
    }
  };

  return (
    <div className="guestbook">
      <h1>Guestbook</h1>

      <section className="sign-guestbook">
        <h2>Sign the Guestbook</h2>
        <form onSubmit={handleSubmit} className="guestbook-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Leave a message..."
            required
          />
          <button type="submit">Sign Guestbook</button>
        </form>
      </section>

      <section className="messages">
        <h2>Messages</h2>
        {messages.map((message) => (
          <div key={message.id} className="message">
            <p className="message-content">{message.content}</p>
            <p className="message-meta">
              - {message.name} on {new Date(message.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Guestbook; 