"use client";

import React, { useEffect, useState } from "react";
import { MdDelete, MdReply } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa'; 
import { AnimatePresence,motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useToken } from '../tokenContext'; 

const Page = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState<any[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [replyVisible, setReplyVisible] = useState(false); 
  const [replyTo, setReplyTo] = useState(""); 
  const [replyFrom, setReplyFrom] = useState(""); 
  const [replySubject, setReplySubject] = useState(""); 
  const [replyMessage, setReplyMessage] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);


  const { token } = useToken();
  console.log('Token in Email:', token); 
  useEffect(() => {
    const fetchEmails = async () => {

      try {
        const response = await fetch(
          "https://hiring.reachinbox.xyz/api/v1/onebox/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`
          );
        }

        const data = await response.json();
        const sortedEmails = (data.data || []).sort(
          (a: any, b: any) =>
            new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        setEmails(sortedEmails);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [token]);

  const deleteEmailThread = async (threadId: string) => {
    if (!token) {
      setError("No token provided");
      return;
    }

    try {
      const response = await fetch(
        `https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      setEmails(emails.filter((email) => email.threadId !== threadId));
      setSelectedThread([]);
      setSelectedEmailId(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const fetchEmailThread = async (threadId: string) => {
    if (!token) {
      setError("No token provided");
      return;
    }

    try {
      const response = await fetch(
        `https://hiring.reachinbox.xyz/api/v1/onebox/messages/${threadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();
      setSelectedThread(data.data);
      setSelectedEmailId(threadId);
      setReplyVisible(false); 
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.toEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendReply = async () => {
    if (!token || !selectedEmailId) {
      setError("No token or thread selected");
      return;
    }

    
    try {
      const response = await fetch(
        `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${selectedEmailId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: replyTo,
            from: replyFrom,
            subject: replySubject,
            body: replyMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
      setSelectedThread([
        ...selectedThread,
        {
          id: `reply-${Date.now()}`,  // Generating a unique ID for the reply
          fromName: replyFrom,
          subject: replySubject,
          body: replyMessage,
          sentAt: new Date().toISOString(),
        }
      ]);

      setReplyTo("");
      setReplyFrom("");
      setReplySubject("");
      setReplyMessage("");

      alert('Reply sent!');
      setReplyVisible(false); 
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="flex items-center">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full animate-spin"></div>
        <span className="ml-3 text-white text-xl font-semibold">Loading...</span>
      </div>
    </div>
  );
  
  
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-white dark:text-black text-3xl font-bold">
        All Inbox(s)
      </h1>
      {emails.length === 0 ? (
        <p className="text-white">No emails found.</p>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* First Column: List of emails with Search Bar */}
          <div className="w-full md:w-1/4 overflow-y-auto rounded-lg  p-4">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* List of Emails */}
      <div className="flex flex-col space-y-4">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={`p-4 rounded-lg shadow-md transition-colors cursor-pointer flex justify-between items-start ${
              selectedEmailId === email.threadId ? 'bg-slate-900' : 'bg-slate-800'
            } hover:bg-slate-800`}
            onClick={() => fetchEmailThread(email.threadId)}
          >
            <div className="flex-grow">
              <div className="flex justify-between mb-2">
                <div className="text-white font-semibold">{email.fromName}</div>
                <div className="text-gray-400 text-sm">
                  {new Date(email.sentAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-white font-bold mb-1">{email.subject}</div>
              <div
                className="text-gray-300 mb-2"
                dangerouslySetInnerHTML={{
                  __html: email.body.substring(0, 100) + '...',
                }}
              ></div>
              <div className="text-gray-400 text-sm">
                To:{' '}
                {email.toName
                  ? `${email.toName} &lt;${email.toEmail}&gt;`
                  : email.toEmail}
              </div>
            </div>
            <button
  onClick={(e) => {
    e.stopPropagation();
    setEmailToDelete(email.threadId);
    setIsModalOpen(true);
  }}
  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
>
  <MdDelete className="text-lg" />
</button>

          </div>
        ))}
      </div>
    </div>

    <AnimatePresence>
  {isModalOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <FiAlertCircle className="text-red-500 text-xl mr-2" />
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        <p>Are you sure you want to delete this email thread?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => {
              // @ts-ignore
              deleteEmailThread(emailToDelete);
              setIsModalOpen(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>



          {/* Second Column: Display Selected Email Thread */}
          <div className="w-full md:w-2/4 rounded-lg p-4">
            {selectedThread.length > 0 ? (
              <div className="space-y-4">
                {selectedThread.map((message: any) => (
                  <div
                    key={message.id}
                    className="bg-gray-800 p-4 rounded-lg shadow-md"
                  >
                    <div className="mb-4">
                      <div className="text-white font-semibold">
                        From: {message.fromName}
                      </div>
                      <div className="text-gray-400 mb-2">
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(message.sentAt).toLocaleString()}
                      </div>
                      <div className="text-white mb-2">
                        <span className="font-semibold">Subject:</span>{" "}
                        {message.subject}
                      </div>
                      <div
                        className="text-white"
                        dangerouslySetInnerHTML={{ __html: message.body }}
                      ></div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setReplyVisible(true); 
                          setReplyTo(message.fromEmail); 
                          setReplyFrom(message.toEmail); 
                          setReplySubject(`Re: ${message.subject}`); 
                        }}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <MdReply className="inline mr-2" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white bg-gray-800  flex items-center justify-center p-4 text-lg font-semibold">
              Select an email to view the thread.
            </p>
            
            )}
          </div>

          {/* Reply Form */}
          {replyVisible && (
            <div className="w-full md:w-1/4 bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-white text-lg font-semibold mb-4">Reply</h2>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">To:</label>
                <input
                  type="text"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">From:</label>
                <input
                  type="text"
                  value={replyFrom}
                  onChange={(e) => setReplyFrom(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Subject:</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Message:</label>
                <textarea
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                ></textarea>
              </div>
              <button
                onClick={sendReply}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                Send Reply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};



export default Page;
