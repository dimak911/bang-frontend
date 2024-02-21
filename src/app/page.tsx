"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import socket from "@src/socket/socket";
import { SocketEventsEnum } from "@src/common/enums/socket/socket-events.enum";

interface FormData {
  username: string;
  roomId: string;
}

export default function Home() {
  const [userNameAlreadySelected, setUserNameAlreadySelected] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const initialSocketConnect = (data: FormData) => {
    setUserNameAlreadySelected(true);
    const { username, roomId } = data;

    socket.auth = { username, roomId };

    socket.connect();

    socket.on(SocketEventsEnum.CONNECTION, () =>
      console.log("socket connected"),
    );

    socket.on(SocketEventsEnum.USER_FIRST_CONNECTED, ({ username, roomId }) => {
      if (username && roomId) {
        localStorage.setItem("username", username);
        localStorage.setItem("roomId", roomId);

        reset();
        router.push(`/room/${roomId}`);
      }
    });

    socket.on(SocketEventsEnum.CONNECT_ERROR, (err) => {
      if (err.message === "invalid username") {
        setUserNameAlreadySelected(false);
      }
    });

    socket.off(SocketEventsEnum.CONNECT_ERROR);
  };

  return (
    <main className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-xs">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit(initialSocketConnect)}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userName"
            >
              Username
            </label>
            <input
              {...register("username", { required: "User name is required" })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300"
              id="userName"
              type="text"
              placeholder="Username"
              autoComplete="off"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="roomId"
            >
              Room ID (optional)
            </label>
            <input
              {...register("roomId")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300"
              id="roomId"
              type="text"
              placeholder="some id"
              autoComplete="off"
            />
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Start
          </button>
        </form>
      </div>
    </main>
  );
}
