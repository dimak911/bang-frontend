import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL || "", {
  autoConnect: false,
});

socket.onAny((event, ...args) => console.log("logger: ", event, ...args));

export default socket;
