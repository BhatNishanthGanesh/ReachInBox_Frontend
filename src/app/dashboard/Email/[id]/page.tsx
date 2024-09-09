// pages/[thread_id].tsx

import { GetServerSideProps } from 'next';
import React from 'react';

interface MessageDetailProps {
  messages: any[]; // Replace with your message type
}

const MessageDetail = ({ messages }: MessageDetailProps) => {
  if (!messages.length) {
    return <div className="text-red-500">No messages found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-white text-3xl font-bold mb-4">Message Details</h1>
      {messages.map((message) => (
        <div key={message.id} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          <div className="text-white font-bold mb-1">{message.subject}</div>
          <div className="text-gray-300 mb-2" dangerouslySetInnerHTML={{ __html: message.body }}></div>
          <div className="text-gray-400 text-sm">From: {message.fromName}</div>
          <div className="text-gray-400 text-sm">To: {message.toName ? `${message.toName} &lt;${message.toEmail}&gt;` : message.toEmail}</div>
          <div className="text-gray-400 text-sm">Sent At: {new Date(message.sentAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { thread_id } = context.query;

  try {
    const response = await fetch(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${thread_id}`);
    console.log(response)
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const data = await response.json();
    console.log(data);
    
    return { props: { messages: data.data || [] } };
  } catch (error) {
    return { props: { messages: [] } };
  }
};

export default MessageDetail;
