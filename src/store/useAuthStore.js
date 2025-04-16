import { create } from "zustand";
import { io } from "socket.io-client";
import { Baseurl } from "../confige";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import Cookies from "js-cookie";
import { useChatStore } from "./useChatStore";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: false, // Authentication check loading state
  isUpdatingProfile: false,
  onlineUsers: [],
  activeTab: "Chats",
  setActiveTab: (tab) => set({ activeTab: tab }),
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/api/v1/user/signup", data);

      toast.success("Account created successfully. Please login.");
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (email, password) => {
    set({ isLoggingIn: true }); // Login start hone par loading true

    try {
      const res = await axios.post(
        `${Baseurl}/api/v1/user/login`,
        { email, password },
        { withCredentials: true }
      );

      // Tokens ko localStorage me save karna
      const { accessToken, refreshToken } = res.data;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      set({ authUser: res.data, isLoggingIn: false }); // Login success
      toast.success("Logged in successfully");
      get().connectSocket();

      return { success: true };
    } catch (error) {
      console.error(
        "Login Error:",
        error.response?.data?.message || error.message
      );
      set({ isLoggingIn: false }); // Login fail hone par loading false
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // API request headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Auth check request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.get(`${Baseurl}/api/v1/user/check`, {
        withCredentials: true,
        headers,
      });

      if (res.data) {
        set({
          authUser: {
            _id: res.data._id,
            fullName: res.data.fullName,
            email: res.data.email,
            role: res.data.role,
            profilePic: res.data.profilePic,
            admin: res.data.admin,
            superAdmin: res.data.superAdmin,
          },
          isCheckingAuth: false, // Auth check complete
        });

        get().connectSocket(); // Authenticated user ke liye socket connect karega
        return { success: true };
      }
    } catch (error) {
      console.error(
        "Auth Check Error:",
        error.response?.data?.message || error.message
      );

      // Unauthorized case me user ko null set karo aur loading false karo
      set({ authUser: null, isCheckingAuth: false });

      return { success: false };
    }
  },

  logout: async (resetChatTab) => {
    try {
      await axiosInstance.post("/api/v1/user/logout", {
        withCredentials: true,
      });

      // ✅ JWT Token Remove (Cookies + LocalStorage)
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken");

      // ✅ Socket Disconnect Karo
      get().disconnectSocket();

      // ✅ Apni ID Online List Se Hatao (Baaki Users Ko Mat Hatao)
      set((state) => ({
        authUser: null,
        onlineUsers: state.onlineUsers.filter(
          (id) => id !== state.authUser?._id
        ), // Apni ID Hatao
        socket: null,
      }));
      useChatStore.setState({ selectedChat: null });

      // ✅ Chat Tab Reset
      if (resetChatTab) resetChatTab();

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (file) => {
    set({ isUpdatingProfile: true });

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = {
        "Content-Type": "multipart/form-data",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };

      const res = await axios.patch(
        `${Baseurl}/api/v1/user/update-profile`,
        formData,
        {
          withCredentials: true,
          headers,
        }
      );

      set({ authUser: res.data, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      console.error(
        "Profile Update Error:",
        error.response?.data?.message || error.message
      );
      set({ isUpdatingProfile: false });
      toast.error(error.response?.data?.message || "Profile update failed");
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  },
  updateUser: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const accessToken = localStorage.getItem("accessToken");

      const headers = {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };

      const res = await axios.patch(
        `${Baseurl}/api/v1/user/update_user`,
        data,
        {
          withCredentials: true,
          headers,
        }
      );

      set({ authUser: res.data, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
      return { success: true };
    } catch (error) {
      console.error(
        "Update User Error:",
        error.response?.data?.message || error.message
      );
      set({ isUpdatingProfile: false });
      toast.error(error.response?.data?.message || "Profile update failed");
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(Baseurl, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
