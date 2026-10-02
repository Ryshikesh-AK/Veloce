import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="pwa-toast animate-fade-in" role="status">
      {message}
    </div>
  );
}
