"use client";

import { FC, useEffect, useState } from "react";
import socket from "@src/socket/socket";
import { SocketEventsEnum } from "@src/common/enums/socket/socket-events.enum";

interface ChatProps {
  roomId: string;
}

type RoomUser = {
  userId: string;
  username: string;
  self: boolean;
  connected: boolean;
};

export const Chat: FC<ChatProps> = ({ roomId }) => {
  const [init, setInit] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [listUsers, setListUsers] = useState<RoomUser[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");

  useEffect(() => {
    if (init) {
      console.log("here me");
      socket.on(SocketEventsEnum.ROOM_USERS, (users) => {
        users.forEach(
          (user: RoomUser) => (user.self = user.userId === socket.id),
        );

        const sortedUsers = users.sort((a: RoomUser, b: RoomUser) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
        setListUsers(sortedUsers);
      });

      socket.on(SocketEventsEnum.CHAT_MESSAGE, ({ message, from }) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on(SocketEventsEnum.USER_CONNECTED, (user) => {
        setListUsers((prevList) => {
          const newListUsers = [...prevList];
          newListUsers.forEach((user) => {
            if (user.self) {
              user.connected = true;
            }
          });
          return newListUsers;
        });
      });

      socket.on(SocketEventsEnum.DISCONNECTED, ({ userId }) => {
        setListUsers((prevList) => {
          prevList.forEach((user) => {
            if (userId === user.userId) {
              user.connected = false;
            }
          });
          return [...prevList];
        });
      });
    }

    setInit(true);

    return () => {
      if (init) {
        socket.disconnect();
      }
      socket.off();
    };
  }, [init]);

  const sendMessage = () => {
    if (selectedUser.length) {
      socket.emit(SocketEventsEnum.MESSAGE, {
        to: selectedUser,
        message: currentMessage,
      });
      setMessages((prevMessages) => [...prevMessages, currentMessage]);
      setCurrentMessage("");
    }
  };

  const handleSelectedUser = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <div className="flex">
      <div className="w-80 border">
        <div>{selectedUser}</div>
        <ul>
          {listUsers.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleSelectedUser(user.userId)}
              className={`cursor-pointer ${user.connected ? "text-green-700" : "text-red-700"}`}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
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
    </div>
  );
};
