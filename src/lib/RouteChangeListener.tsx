"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import socket from "@src/socket/socket";

export function RouteChangeListener() {
  const pathname = usePathname();

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    const username = localStorage.getItem("username");

    if (!pathname.includes("room") && roomId && username) {
      console.log("disconnected");
      socket.disconnect();
      localStorage.removeItem("roomId");
      localStorage.removeItem("username");
    }
  }, [pathname]);

  return <></>;
}
