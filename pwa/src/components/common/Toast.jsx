import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  const content = typeof message === 'object' && message !== null ? (message.message || JSON.stringify(message)) : String(message);
  return (
    <div className="pwa-toast animate-fade-in" role="status">
      {content}
    </div>
  );
}
