import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import { Send, Bot, User, HelpCircle, Mic, Plus } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Financial Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestions = [
    "How is my portfolio performing?",
    "What stocks should I invest in?",
    "Explain recent market trends",
    "Generate a financial report",
    "Analyze my spending habits",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      const response = await fetch("https://hackstack-api-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botResponse = {
        id: messages.length + 2,
        text: data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error processing request:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          text: "⚠️ Error processing your request.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in your browser. Try Chrome.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event);
      };
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <Bot size={24} />
          <h2>AI Financial Assistant</h2>
        </div>
        <div className="chatbot-actions">
          <button className="icon-button">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender === "bot" ? "bot" : "user"}`}>
              <div className="message-avatar">
                {message.sender === "bot" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="message-content">
                <div className="message-text">
                  {message.sender === "bot" ? renderStructuredResponse(message.text) : message.text}
                </div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input">
        <button className="input-action">
          <Plus size={20} />
        </button>
        <input 
          type="text" 
          placeholder="Ask me anything about your finances..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={handleKeyPress} 
        />
        <button className="input-action" onClick={handleVoiceInput}>
          <Mic size={20} color={isRecording ? "red" : "white"} />
        </button>
        <button className={`send-button ${input.trim() !== '' ? 'active' : ''}`} onClick={handleSend} disabled={input.trim() === ''}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

// Function to render structured bot responses
const renderStructuredResponse = (text) => {
  if (text.includes("\n- ") || text.includes("\n* ")) {
    return (
      <ul>
        {text.split("\n").map((line, idx) =>
          line.startsWith("- ") || line.startsWith("* ") ? (
            <li key={idx}>{line.substring(2)}</li>
          ) : (
            <p key={idx}>{line}</p>
          )
        )}
      </ul>
    );
  }

  if (/^\d+\.\s/.test(text)) {
    return (
      <ol>
        {text.split("\n").map((line, idx) =>
          /^\d+\.\s/.test(line) ? <li key={idx}>{line.substring(3)}</li> : <p key={idx}>{line}</p>
        )}
      </ol>
    );
  }

  if (text.includes("### ")) {
    return (
      <div>
        {text.split("\n").map((line, idx) =>
          line.startsWith("### ") ? <h3 key={idx}>{line.substring(4)}</h3> : <p key={idx}>{line}</p>
        )}
      </div>
    );
  }

  return <p>{text}</p>;
};

export default Chatbot;
