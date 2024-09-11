"use client";

import React, { useEffect, useState } from "react";
import { MdDelete, MdReply } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useToken } from "../tokenContext";
import { dummyEmails } from "./_components/api";

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
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);

  const { token } = useToken();
  console.log("Token in Email:", token);
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "r") {
        setReplyVisible((prev) => !prev);
      } else if (e.key === "d" && hoveredEmail) {
        setIsModalOpen(true);
       
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
  
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [hoveredEmail]); 
  
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
      setEmailToDelete(null);
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
  const filteredEmails = emails.filter(
    (email) =>
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
          id: `reply-${Date.now()}`,
          fromName: replyFrom,
          subject: replySubject,
          body: replyMessage,
          sentAt: new Date().toISOString(),
        },
      ]);

      setReplyTo("");
      setReplyFrom("");
      setReplySubject("");
      setReplyMessage("");

      alert("Reply sent!");
      setReplyVisible(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 dark:bg-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-opacity-50 rounded-full animate-spin"></div>
          <span className="ml-3 text-white dark:text-black text-xl font-semibold">
            Loading...
          </span>
        </div>
      </div>
    );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Inbox Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-4">
          <h1 className="text-2xl font-bold text-blue-600">All Inbox(s)</h1>
          <div className="flex items-center space-x-2">
            <span className="text-white">25/25</span>
            <span className="text-gray-400">Inboxes selected</span>
          </div>
        </div>
        {/* User Info */}
        <div className="mt-4 md:mt-0 bg-slate-800 p-2 rounded-md text-white">
          <h2 className="text-xl">Shaw Adley</h2>
          <p>shaw@getmemeetings.com</p>
        </div>
      </div>

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
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-black placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-800 text-gray-400" />
            </div>

            {/* List of Emails */}
            <div className="flex flex-col space-y-4 dark:text-white">
              <div className="flex justify-between items-center">
                <div><span className="text-blue-500 bg-gray-200  p-1 rounded-full">26</span> <span className="text-white">New Replies</span></div>
                <div className="text-white">Newest</div>
              </div>
              {/* These are obtained from api's */}
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 rounded-lg shadow-md transition-colors cursor-pointer flex justify-between items-center ${
                    selectedEmailId === email.threadId
                      ? "bg-slate-900 dark:bg-slate-200 border-l-4 border-blue-500"
                      : "bg-slate-800 dark:bg-slate-100"
                  } hover:bg-slate-800`}
                  onClick={() => fetchEmailThread(email.threadId)}
                  onMouseEnter={() => setHoveredEmail(email.threadId)}
                  onMouseLeave={() => setHoveredEmail(null)}
                >
                  {/* Email Content */}
                  <div className="flex-grow">
                    <div className="text-white dark:text-black font-semibold mb-2">
                      {email.fromName}
                    </div>
                    <div
                      className="text-gray-300 dark:text-gray-700 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: email.body.substring(0, 50) + "...",
                      }}
                    ></div>
                  </div>

                  {/* Date and Delete Button in Column */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-gray-400 mb-3 text-sm">
                      {new Date(email.sentAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmailToDelete(email.threadId);
                        setIsModalOpen(true);
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Below ones are from custom api's */}
              {dummyEmails.map((email)=>(
                  <div
                  key={email.id}
                  className={"p-4 cursor-not-allowed rounded-lg shadow-md transition-colors  flex justify-between items-center dark:bg-slate-100 bg-slate-900"}
                >
                  {/* Email Content */}
                  <div className="flex-grow">
                    <div className="text-white dark:text-black font-semibold mb-2">
                      {email.fromName}
                    </div>
                    <div
                      className="text-gray-300  dark:text-gray-700 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: email.body.substring(0, 50) + "...",
                      }}
                    ></div>
                  </div>

                  {/* Date and Delete Button in Column */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-gray-400 mb-3 text-sm">
                      {new Date(email.sentAt).toLocaleDateString()}
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <h2 className="text-lg font-bold">Confirm Deletion</h2>
              </div>
              <p className="mt-2">
                Are you sure you want to delete this email thread?
              </p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    if (emailToDelete) {
                      deleteEmailThread(emailToDelete);
                      setIsModalOpen(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
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
                    className="bg-gray-800 dark:bg-gray-200 dark:text-gray-200 p-4 rounded-lg shadow-md"
                  >
                    <div className="mb-4">
                      <div className="text-white dark:text-black font-semibold">
                        From: {message.fromName}
                      </div>
                      <div className="text-gray-400 dark:text-gray-800 mb-2">
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(message.sentAt).toLocaleString()}
                      </div>
                      <div className="text-white dark:text-black mb-2">
                        <span className="font-semibold">Subject:</span>{" "}
                        {message.subject}
                      </div>
                      <div
                        className="text-white dark:text-black"
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
              <p className="text-white bg-gray-800 dark:bg-gray-200 dark:text-black shadow-lg  flex items-center justify-center p-4 text-lg font-semibold">
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
