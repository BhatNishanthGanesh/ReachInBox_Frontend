"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdDelete, MdReply } from 'react-icons/md';
import { FaSearch } from 'react-icons/fa'; 
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

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

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const fetchEmails = async () => {
      if (!token) {
        setError("No token provided");
        setLoading(false);
        return;
      }

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
    } finally {
      setIsModalOpen(false); 
      setEmailToDelete(null); // Reset the email to delete
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

      // Clear the reply form
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

  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.toEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="w-full md:w-1/4 overflow-y-auto rounded-lg p-4">
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
                  } hover:bg-slate-700`}
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
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Second Column: Selected Email Thread */}
          <div className="w-full md:w-3/4 overflow-y-auto rounded-lg p-4">
            {selectedThread.length > 0 ? (
              <div className="space-y-4">
                {selectedThread.map((email) => (
                  <div
                    key={email.id}
                    className={`p-4 rounded-lg shadow-md ${
                      email.from === replyTo ? 'bg-slate-900' : 'bg-slate-800'
                    }`}
                  >
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
                        __html: email.body,
                      }}
                    ></div>
                    <button
                      onClick={() => {
                        setReplyVisible(true);
                        setReplyTo(email.from);
                        setReplyFrom(email.to);
                        setReplySubject(`Re: ${email.subject}`);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MdReply size={20} />
                    </button>
                  </div>
                ))}

                {/* Reply Form */}
                {replyVisible && (
                  <div className="mt-4 p-4 bg-slate-900 rounded-lg">
                    <h2 className="text-white text-xl font-bold mb-2">Reply</h2>
                    <textarea
                      placeholder="Type your message..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full p-2 mb-2 rounded-lg bg-gray-800 text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={5}
                    ></textarea>
                    <button
                      onClick={sendReply}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white">Select an email to view details.</p>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center mb-4">
                <FiAlertCircle className="text-red-500 mr-2" size={24} />
                <h2 className="text-black text-lg font-bold">Confirm Deletion</h2>
              </div>
              <p className="text-black mb-4">
                Are you sure you want to delete this email thread?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (emailToDelete) {
                      deleteEmailThread(emailToDelete);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;
