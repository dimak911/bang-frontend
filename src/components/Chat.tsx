"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";


let socket: Socket;

export const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  const searchParams = useSearchParams()


  const roomId  = searchParams.get('room')
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_LOCAL_BASE_API_URL || "", {
    // socket = io(process.env.NEXT_PUBLIC_BASE_API_URL || "", {
    //   extraHeaders: {
    //     "ngrok-skip-browser-warning": "69420",
    //   },
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.emit('join room', roomId)

    socket.on("message", ({redis, message }) => {
      console.log("message: ", message);
      console.log("redisTest: ", redis);

      setMessages((prevMessages) => [...prevMessages, message]);
    });




    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    console.log(currentMessage);
    socket.emit("chat message", { roomId: roomId, message: currentMessage });
    setCurrentMessage("");
  };

  return (
    <div className="flex gap-2 flex-col w-80">
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}

      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
