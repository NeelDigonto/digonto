"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./AiChat.module.css";
import { Engine } from "@/core/Engine";
import type {
  CreateChatSessionWSRequest,
  CreateChatSessionWSResponse,
  ReadAllChatMessagesWSResponse,
  ReadAllChatSessionsWSResponse,
} from "@gateway/src/modules/chat/schema";
import {
  RootWSClientRequest,
  RootWSServerResponse,
  WSClientEventType,
  WSServerEventType,
} from "@gateway/src/types/core";

export type WebChatSession = ReadAllChatSessionsWSResponse[number] & {
  messages: (ReadAllChatMessagesWSResponse[number] & {
    isStreaming: boolean;
  })[];
};

export default function AiChatPage() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [chatSessions, setChatSessions] = useState<WebChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<WebChatSession | null>(
    null
  );

  // ---------------------------------------------------------
  // -------------------- Styling ----------------------------
  // ---------------------------------------------------------
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
  }, [currentSession?.messages]);
  // ---------------------------------------------------------

  const createNewSession = async () => {
    const newSession: CreateChatSessionWSRequest = {
      title: "New Chat",
    };

    const clearEventRegister = await window.engine.sendEvent(
      WSClientEventType.CREATE_CHAT_SESSION,
      newSession,
      (event: RootWSServerResponse) => {
        if (event.type === WSServerEventType.CREATE_CHAT_SESSION_RESPONSE) {
          const createdSession: CreateChatSessionWSResponse = event.data;
          setChatSessions((prev) => [
            {
              ...createdSession,
              messages: [],
            },
            ...prev,
          ]);

          setCurrentSession({
            ...createdSession,
            messages: [],
          });

          setIsSidebarOpen(false);
        }
      }
    );

    clearEventRegister();
  };

  const selectSession = (session: WebChatSession) => {
    setCurrentSession(session);
    setIsSidebarOpen(false);
  };

  /* const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    let sessionToUpdate = currentSession;

    // Create new session if none exists
    if (!sessionToUpdate) {
      sessionToUpdate = {
        id: crypto.randomUUID(),
        title: "New Chat",
        lastMessage: "",
        timestamp: new Date(),
        messages: [],
      };
      setChatSessions((prev) => [sessionToUpdate!, ...prev]);
      setCurrentSession(sessionToUpdate);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Update session with new message
    const updatedMessages = [...sessionToUpdate.messages, userMessage];
    const updatedSession = {
      ...sessionToUpdate,
      messages: updatedMessages,
      lastMessage: userMessage.content,
      timestamp: new Date(),
    };

    // Update title if it's the first message
    if (sessionToUpdate.messages.length === 0) {
      updatedSession.title =
        userMessage.content.length > 30
          ? userMessage.content.substring(0, 30) + "..."
          : userMessage.content;
    }

    setCurrentSession(updatedSession);
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionToUpdate!.id ? updatedSession : session
      )
    );

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
          conversationId: sessionToUpdate.id,
          message: userMessage.content,
        },
      };

      window.engine.sendMessage(userChatMessageEvent);

      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "This is a simulated AI response. Replace this with actual AI integration.",
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        const finalSession = {
          ...updatedSession,
          messages: finalMessages,
          lastMessage: aiMessage.content,
          timestamp: new Date(),
        };

        setCurrentSession(finalSession);
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === sessionToUpdate!.id ? finalSession : session
          )
        );
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      const errorMessages = [...updatedMessages, errorMessage];
      const errorSession = {
        ...updatedSession,
        messages: errorMessages,
        lastMessage: errorMessage.content,
        timestamp: new Date(),
      };

      setCurrentSession(errorSession);
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === sessionToUpdate!.id ? errorSession : session
        )
      );
      setIsLoading(false);
    }
  }; */

  const handleSendMessage = async () => {};

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
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Chats</h2>
          <button className={styles.newChatButton} onClick={createNewSession}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
              <path d="M12 7v6" />
              <path d="M9 10h6" />
            </svg>
          </button>
        </div>

        <div className={styles.chatList}>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`${styles.chatItem} ${
                currentSession?.id === session.id ? styles.chatItemActive : ""
              }`}
              onClick={() => selectSession(session)}
            >
              <div className={styles.chatItemContent}>
                <h3 className={styles.chatItemTitle}>{session.title}</h3>
                <p className={styles.chatItemPreview}>
                  {session.messages.length || "No messages yet"}
                </p>
              </div>
              <div className={styles.chatItemTime}>
                {formatTime(session.createdAt)}
              </div>
            </div>
          ))}

          {chatSessions.length === 0 && (
            <div className={styles.emptyChatList}>
              <p>No chats yet. Start a conversation!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className={styles.chatMain}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderInfo}>
            <h1 className={styles.chatTitle}>
              {currentSession ? currentSession.title : "AI Assistant"}
            </h1>
            <span className={styles.chatSubtitle}>Powered by Gemini Pro</span>
          </div>

          <button
            className={styles.newChatHeaderButton}
            onClick={createNewSession}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
              <path d="M12 7v6" />
              <path d="M9 10h6" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {!currentSession || currentSession.messages.length === 0 ? (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>✨</div>
              <h2>Hello! How can I help you today?</h2>
              <p>Ask me anything, and I'll do my best to assist you.</p>
            </div>
          ) : (
            currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>
                    {message.content}
                    {message.isStreaming && (
                      <span className={styles.cursor}>▊</span>
                    )}
                  </div>
                  <div className={styles.messageTime}>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && currentSession && (
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

        {/* Input */}
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
