"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import socket from "@src/socket/socket";
import { SocketEventsEnum } from "@src/common/enums/socket/socket-events.enum";

type RoomUser = {
  id: string;
  username: string;
  self: boolean;
  connected: boolean;
};

type RoomLogType = { id: string; user: string; text: string };

export const Room = () => {
  const [listUsers, setListUsers] = useState<RoomUser[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [roomLogs, setRoomLogs] = useState<RoomLogType[]>([]);

  const { id: roomId } = useParams();

  useEffect(() => {
    const existingRoomId = localStorage.getItem("roomId");
    const existingUsername = localStorage.getItem("username");

    if (existingRoomId && existingUsername) {
      socket.auth = { roomId: existingRoomId, username: existingUsername };
      socket.connect();
    }

    socket.emit(SocketEventsEnum.ROOM_USERS, roomId);

    socket.on(SocketEventsEnum.ROOM_USERS, (users) => {
      console.log("users: ", users);

      users.forEach((user: RoomUser) => {
        user.self = user.id === socket.id;
      });

      setListUsers(users);
    });

    socket.on(SocketEventsEnum.ROOM_LOG, (data: RoomLogType) => {
      setRoomLogs((prevState) => [...prevState, data]);
    });

    socket.on(SocketEventsEnum.MESSAGE, (message) => {
      console.log("message: ", message);
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
          if (userId === user.id) {
            user.connected = false;
          }
        });
        return [...prevList];
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [roomId]);

  const sendMessage = () => {
    socket.emit(SocketEventsEnum.MESSAGE, { message: currentMessage, roomId });
    setCurrentMessage("");
  };

  return (
    <div className="flex">
      <div className="w-[300px]">
        <p>{`Players: (${listUsers.length})`}</p>
        <ul>
          {listUsers.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer ${user.connected ? "text-green-700" : "text-red-700"}`}
            >
              {`${user.username} (${user.id})`}
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-6">
        <p>Room logs:</p>
        <ul>
          {roomLogs.map((log) => (
            <li key={log.id}>{`${log.user}: ${log.text}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
