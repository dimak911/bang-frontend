"use client";

import React, { useEffect, useState } from "react";
import socket from "@src/socket/socket";
import { SocketEventsEnum } from "@src/common/enums/socket/socket-events.enum";

interface RoomLog {
  userId: string;
  roomIdConnected: string;
}

const Logs = () => {
  const [roomLogs, setRoomLogs] = useState<RoomLog[]>([]);
  useEffect(() => {
    socket.on(
      SocketEventsEnum.USER_CONNECTED,
      ({ userId, roomIdConnected }: RoomLog) => {
        setRoomLogs((prevLogs) => [...prevLogs, { userId, roomIdConnected }]);
      },
    );

    return () => {
      socket.off(SocketEventsEnum.USER_CONNECTED);
    };
  }, []);

  return (
    <div>
      <h1>Log comp</h1>
      <ul>
        {roomLogs.map((log) => (
          <li key={log.userId}>
            User <span className="text-blue-700">{log.userId}</span>, are
            connected
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Logs;
