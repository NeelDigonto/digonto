"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AiChat.module.css";
import { Engine } from "@/core/Engine";
import { isBrowser } from "../../../../types/core";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function AiChatPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.engine) {
      window.engine = new Engine();
    }
  }, []);

  useEffect(() => {
    // Prevent body scroll when chat is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const userChatMessageEvent = {
        timestamp: new Date().toISOString(),
        uid: crypto.randomUUID(),
        type: "USER_MESSAGE",
        data: {
          conversationId: conversationId || crypto.randomUUID(),
          message: userMessage.content,
        },
      };

      window.engine.sendMessage(userChatMessageEvent);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>AI Assistant</h1>
            <span className={styles.subtitle}>Powered by Gemini Pro</span>
          </div>
          <button
            className={styles.newChatButton}
            onClick={() => {
              setMessages([]);
              setConversationId(null);
            }}
          >
            New Chat
          </button>
        </div>

        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>✨</div>
              <h2>Hello! How can I help you today?</h2>
              <p>Ask me anything, and I'll do my best to assist you.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${
                message.role === "user"
                  ? styles.userMessage
                  : styles.assistantMessage
              }`}
            >
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageRole}>
                    {message.role === "user" ? "You" : "AI"}
                  </span>
                  <span className={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className={styles.messageText}>
                  {message.content}
                  {message.isStreaming && (
                    <span className={styles.cursor}>▊</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div
              className={`${styles.messageWrapper} ${styles.assistantMessage}`}
            >
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            className={styles.input}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className={styles.sendButton}
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
