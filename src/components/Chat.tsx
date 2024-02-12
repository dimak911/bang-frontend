"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io({
  withCredentials: false,
});

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", currentMessage);
    setCurrentMessage("");
  };

  return (
    <div className="flex gap-2">
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}

      <input
        className="shadow appearance-none border rounded w-80 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="input"
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}
