import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, push, onValue } from 'firebase/database';

function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');

  // Load messages when component mounts
  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and reverse to show newest first
        const messagesList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        })).reverse();
        setMessages(messagesList);
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !name.trim()) return;
    
    const message = {
      name: name,
      content: newMessage,
      date: new Date().toLocaleDateString()
    };
    
    // Push new message to Firebase
    const messagesRef = ref(db, 'messages');
    push(messagesRef, message);
    
    setNewMessage('');
    setName('');
  };

  return (
    <div className="guestbook">
      <h1>Guestbook</h1>
      
      <section className="hero">
        <h2>Hi, I'm MJ</h2>
        <p>I love life</p>
      </section>

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
              - {message.name} on {message.date}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Guestbook; 