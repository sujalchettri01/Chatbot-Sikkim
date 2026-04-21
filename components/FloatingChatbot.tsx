"use client";

import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi 👋 I am Daju, your local guide for Sikkim! Ask me anything about Sikkim travel, permits, destinations, or any services.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      const replyText =
        data?.reply ||
        data?.results ||
        data?.message ||
        data?.error ||
        "Sorry, I could not get a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: replyText,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong. Please try again or call us at +91 70011 03688 🏔️",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Toggle Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-white shadow-lg hover:opacity-90 transition-opacity"
        >
          <span>💬</span>
          <span className="font-bold">Ask Daju</span>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="flex h-[520px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div>
                <h2 className="text-sm font-bold">Ask Guide Daju</h2>
                <p className="text-xs text-white/80">Go Visit Sikkim</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-lg hover:bg-white/30 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  } max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-6 whitespace-pre-wrap`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                  <span className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.15s" }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>•</span>
                  </span>
                </div>
              </div>
            )}

            {/* Auto scroll anchor */}
            <div ref={messagesEndRef} />
          </div>


{/* Input */}
<div className="flex gap-2 border-t border-gray-100 bg-white p-3">
  <input
    ref={inputRef}
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }}
    placeholder="Type your message..."
    disabled={loading}
    className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100 disabled:opacity-70"
  />

  <button
    onClick={sendMessage}
    disabled={loading || !input.trim()}
    className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm text-white shadow-md transition-all hover:scale-105 hover:opacity-90 disabled:opacity-50"
  >
    Send
  </button>
</div>
          {/* Footer */}
          <div className="pb-2 text-center text-xs text-gray-400">
            Powered by Go Visit Sikkim • +91 70011 03688
          </div>
        </div>
      )}
    </div>
  );
}
