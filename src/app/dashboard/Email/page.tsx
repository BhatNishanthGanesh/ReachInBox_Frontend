"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
 
  useEffect(() => {
    const fetchEmails = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://hiring.reachinbox.xyz/api/v1/onebox/list', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const data = await response.json();
        const sortedEmails = (data.data || []).sort((a: any, b: any) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        setEmails(sortedEmails);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-white dark:text-black text-3xl font-bold mb-4">All Inbox(s)</h1>
      {emails.length === 0 ? (
        <p className="text-white">No emails found.</p>
      ) : (
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-screen">
          {emails.map((email) => (
            <Link key={email.id} href={`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${email.threadId}`}>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md transition-colors cursor-pointer">
                <div className="flex justify-between mb-2">
                  <div className="text-white font-semibold">{email.fromName}</div>
                  <div className="text-gray-400 text-sm">{new Date(email.sentAt).toLocaleDateString()}</div>
                </div>
                <div className="text-white font-bold mb-1">{email.subject}</div>
                <div className="text-gray-300 mb-2" dangerouslySetInnerHTML={{ __html: email.body.substring(0, 100) + '...' }}></div>
                <div className="text-gray-400 text-sm">To: {email.toName ? `${email.toName} &lt;${email.toEmail}&gt;` : email.toEmail}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
