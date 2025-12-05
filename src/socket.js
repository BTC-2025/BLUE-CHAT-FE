import { io } from "socket.io-client";
export const socket = io("http://localhost:5001", {
  autoConnect: false,
  auth: (cb) => {
    // set userId at connect time
    const user = JSON.parse(localStorage.getItem("auth_user") || "null"); // or from context
    cb({ userId: user?.id });
  }
});
