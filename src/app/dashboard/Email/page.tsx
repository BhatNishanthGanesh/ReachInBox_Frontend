"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MdDelete } from 'react-icons/md';

const Page = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [selectedThread, setSelectedThread] = useState<any>(null); // Selected email thread
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null); // Selected email ID

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

  // Delete email thread
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

      // Remove the deleted thread from the emails list
      setEmails(emails.filter((email) => email.threadId !== threadId));
      setSelectedThread(null); // Deselect if it was the selected thread
      setSelectedEmailId(null); // Deselect email
    } catch (error) {
      setError((error as Error).message);
    }
  };

  // Fetch email thread based on threadId
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
      setSelectedThread(data.data); // Set the selected thread data
      setSelectedEmailId(threadId); // Set selected email ID
    } catch (error) {
      setError((error as Error).message);
    }
  };

  // Filter emails based on search query
  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.toEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-white dark:text-black text-3xl font-bold ">
        All Inbox(s)
      </h1>
      {emails.length === 0 ? (
        <p className="text-white">No emails found.</p>
      ) : (
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* First Column: List of emails with Search Bar */}
          <div className="w-full md:w-1/4 overflow-y-auto rounded-lg">
            {/* Search Bar */}
            <div className="mb-4 p-4">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
            </div>

            {/* List of Emails */}
            <div className="flex flex-col space-y-4">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 rounded-lg shadow-md transition-colors cursor-pointer flex justify-between items-start ${
                    selectedEmailId === email.threadId
                      ? "bg-gray-700" // Highlight selected email
                      : "bg-gray-800"
                  }`}
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
                        __html: email.body.substring(0, 100) + "...",
                      }}
                    ></div>
                    <div className="text-gray-400 text-sm">
                      To:{" "}
                      {email.toName
                        ? `${email.toName} &lt;${email.toEmail}&gt;`
                        : email.toEmail}
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from propagating to the email div
                      deleteEmailThread(email.threadId);
                    }}
                    className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                  >
                    <MdDelete className="mr-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Second Column: Display Selected Email Thread */}
          <div className="w-full md:w-2/4 rounded-lg p-4">
            {selectedThread ? (
              <div className="space-y-4">
                {selectedThread.map((message: any) => (
                  <div
                    key={message.id}
                    className="p-6 bg-gray-800 rounded-lg shadow-md"
                  >
                    <h1 className="text-white mb-2">{message.fromName}</h1>
                    {/* Mail Header */}
                    <div className="mb-4">
                      <div className="text-gray-300 text-sm mb-2">
                        <span className="font-bold">From:</span>{" "}
                        {message.fromName} &lt;{message.fromEmail}&gt;
                      </div>
                      <div className="text-gray-300 text-sm mb-2">
                        <span className="font-bold">To:</span>{" "}
                        {message.toName
                          ? `${message.toName} &lt;${message.toEmail}&gt;`
                          : message.toEmail}
                      </div>
                      <div className="text-gray-300 text-sm mb-2">
                        <span className="font-bold">Date:</span>{" "}
                        {new Date(message.sentAt).toLocaleString()}
                      </div>
                      <div className="text-white text-sm font-bold mb-2">
                        {message.subject}
                      </div>
                    </div>

                    {/* Mail Body */}
                    <div
                      className="text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.body }}
                    ></div>

                    {/* Divider */}
                    <hr className="border-gray-600 my-4" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Select an email to view details.</p>
            )}
          </div>
          <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4">
            {/* Lead Details Section */}
            <h4 className="text-white text-xl font-semibold mb-4">Lead Details</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="font-medium">Name</div>
                <div>Shaw Adley</div>
              </div>
              <div className="grid grid-cols-2 gap-4  text-white">
                <div className="font-medium">Email</div>
                <div>shaw@gmail.com</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="font-medium">Phone</div>
                <div>+1 (415) 555-1234</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="font-medium">Company</div>
                <div>Example Corp.</div>
              </div>
            </div>

            {/* Activities Section */}
            <h4 className="text-white text-xl font-semibold mt-6 mb-4">Activities</h4>
            <div className="space-y-2 text-white">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></div>
                <div>Sent email to Shaw Adley regarding the product demo.</div>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></div>
                <div>Received response from Shaw Adley with positive feedback.</div>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-500 mr-2"></div>
                <div>Follow-up email scheduled for next week.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
