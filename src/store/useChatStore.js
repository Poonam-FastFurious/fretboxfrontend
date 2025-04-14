import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axios from "axios";
import { Baseurl } from "../confige";

export const useChatStore = create((set, get) => ({
  selectedChat: null,
  messages: [],
  chatList: [], // ✅ Store chat list
  userList: [], // ✅ Store user list
  chatuserList: [], // ✅ Store user list
  isUsersLoading: false,
  ischatUsersLoading: false,
  isMessagesLoading: false,
  isChatListLoading: false,
  isProfileOpen: false,

  fetchChats: async () => {
    set({ isChatListLoading: true });

    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Chats fetch request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.get(`${Baseurl}/api/v1/chats`, {
        withCredentials: true,
        headers,
      });

      set({ chatList: res.data, isChatListLoading: false });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error(error.response?.data?.message || "Failed to load chats");
      set({ isChatListLoading: false });
    }
  },

  getMessages: async () => {
    const { selectedChat } = get();
    if (!selectedChat) return;

    set({ isMessagesLoading: true });

    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Messages fetch request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.get(
        `${Baseurl}/api/v1/message/${selectedChat._id}`,
        {
          withCredentials: true,
          headers,
        }
      );

      set({
        messages: res.data.messages, // Now correctly extracting messages
        totalMessages: res.data.totalMessages, // Save total messages if needed
        currentPage: res.data.currentPage, // Save pagination data if needed
        totalPages: res.data.totalPages, // Save pagination data if needed
        isMessagesLoading: false,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages");
      set({ isMessagesLoading: false });
    }
  },

  /** ✅ Send a message */
  sendMessage: async (messageData, selectedChat) => {
    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Message send request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.post(
        `${Baseurl}/api/v1/message/send/${selectedChat._id}`,
        messageData,
        {
          withCredentials: true,
          headers,
        }
      );

      set({ messages: [...get().messages, res.data] }); // Add sent message to store

      await get().fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  sendPoll: async (pollData, selectedChat) => {
    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Poll send request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.post(
        `${Baseurl}/api/v1/message/send-poll/${selectedChat._id}`,
        pollData,
        {
          withCredentials: true,
          headers,
        }
      );

      set({ messages: [...get().messages, res.data] }); // Add poll to messages
    } catch (error) {
      console.error("Error sending poll:", error);
      toast.error(error.response?.data?.message || "Failed to send poll");
    }
  },

  voteOnPoll: async (messageId, optionIndex) => {
    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Vote request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.post(
        `${Baseurl}/api/v1/message/vote`,
        { messageId, optionIndex },
        {
          withCredentials: true,
          headers,
        }
      );

      // ✅ Update the specific message in the store
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, poll: res.data.poll } : msg
        ),
      }));

      toast.success("Vote submitted successfully!");
    } catch (error) {
      console.error("Error voting on poll:", error);
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  },

  deleteMessage: async (messageId) => {
    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Delete request bhejo (cookies bhi bhej rahe hain)
      await axios.delete(`${Baseurl}/api/v1/message/delete/${messageId}`, {
        withCredentials: true,
        headers,
      });

      // ✅ Remove deleted message from store
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));

      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  fetchUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get(`${Baseurl}/api/v1/user/alluser`, {
        withCredentials: true,
      });

      set({ userList: res.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
      set({ isUsersLoading: false });
    }
  },

  fetchChatUsers: async () => {
    set({ ischatUsersLoading: true });
    try {
      // Fetch accessToken from localStorage
      const accessToken = localStorage.getItem("accessToken");

      // Set headers if accessToken is available
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      const res = await axios.get(`${Baseurl}/api/v1/user/contact`, {
        withCredentials: true,
        headers, // Include Authorization header
      });

      set({ chatuserList: res.data, ischatUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
      set({ ischatUsersLoading: false });
    }
  },

  accessChat: async (receiverId) => {
    if (!receiverId) {
      toast.error("Receiver ID is required");
      return;
    }

    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Chat access request bhejo (cookies bhi bhej rahe hain)
      const res = await axios.post(
        `${Baseurl}/api/v1/chats/access`,
        { receiverId },
        {
          withCredentials: true,
          headers,
        }
      );

      console.log("Chat accessed:", res.data); // Debugging

      set({ selectedChat: res.data }); // ✅ Set selectedChat with correct data
      get().subscribeToMessages(); // ✅ Subscribe to real-time updates
    } catch (error) {
      console.error("Error accessing chat:", error);
      toast.error(error.response?.data?.message || "Failed to access chat");
    }
  },

  subscribeToMessages: () => {
    const { selectedChat } = get(); // ✅ Use selectedChat instead of selectedUser
    if (!selectedChat) return; // Ensure a chat is selected

    const socket = useAuthStore.getState().socket;
    console.log("✅ Subscribing to messages, Socket:", socket);

    socket.on("newMessage", (newMessage) => {
      console.log("📩 New message received:", newMessage);
      if (newMessage.chat !== selectedChat._id) return;

      set({ messages: [...get().messages, newMessage] });
      get().fetchChats();
    });

    socket.on("messageDeleted", ({ messageId }) => {
      console.log("🗑 Message deleted event received:", messageId);

      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    });

    socket.on("pollUpdated", ({ messageId, poll }) => {
      console.log("📊 Poll updated:", messageId);

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, poll } : msg
        ),
      }));
    });
  },
  fetchChatDetails: async (chatId) => {
    if (!chatId) return;

    set({ loading: true, error: null });

    try {
      // Pehle localStorage se accessToken fetch karo
      const accessToken = localStorage.getItem("accessToken");

      // Headers set karo agar accessToken available hai
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // Fetch API ke liye headers aur credentials include karo
      const response = await fetch(`${Baseurl}/api/v1/chats/${chatId}`, {
        method: "GET",
        credentials: "include", // Cookies ke liye
        headers,
      });

      if (!response.ok) throw new Error("Failed to fetch chat details");

      const data = await response.json();
      set({ chatDetails: data });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message || "Failed to fetch chat details");
    } finally {
      set({ loading: false });
    }
  },

  createGroupChat: async ({ name, users, image }) => {
    if (!name || !users || users.length < 2) {
      toast.error("At least two users are required for a group chat");
      return;
    }
  
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      const headers = accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data", // Optional, axios sets it automatically
          }
        : {};
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("users", JSON.stringify(users)); // Users array as string
      if (image) {
        formData.append("image", image); // Append image file
      }
  
      const res = await axios.post(`${Baseurl}/api/v1/chats/group`, formData, {
        withCredentials: true,
        headers,
      });
  
      set((state) => ({
        chatList: [...state.chatList, res.data],
      }));
  
      toast.success("Group chat created successfully!");
      return res.data;
    } catch (error) {
      console.error("Error creating group chat:", error);
      toast.error(error.response?.data?.message || "Failed to create group chat");
    }
  },
  

  renameGroupChat: async (chatId, newName) => {
    if (!chatId || !newName) {
      toast.error("Chat ID and new name are required");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // API call to rename the group chat
      const { data: updatedChat } = await axios.patch(
        `${Baseurl}/api/v1/chats/group/rename`,
        { chatId, name: newName },
        {
          withCredentials: true,
          headers,
        }
      );

      // ✅ Update chat list & selected chat with response data
      set((state) => ({
        chatList: state.chatList.map((chat) =>
          chat._id === chatId ? updatedChat : chat
        ),
        selectedChat:
          state.selectedChat?._id === chatId ? updatedChat : state.selectedChat,
      }));

      toast.success("Group name updated successfully!");
    } catch (error) {
      console.error("Error renaming group chat:", error);
      toast.error(
        error.response?.data?.message || "Failed to rename group chat"
      );
    }
  },
  removeUserFromGroup: async (chatId, userId) => {
    if (!chatId || !userId) {
      toast.error("Chat ID and User ID are required");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      // API call to remove user from group
      const { data: updatedChat } = await axios.put(
        `${Baseurl}/api/v1/chats/remove`,
        { chatId, userId },
        {
          withCredentials: true,
          headers,
        }
      );

      // ✅ Update chat list & selected chat with response data
      set((state) => ({
        chatList: state.chatList.map((chat) =>
          chat._id === chatId ? updatedChat : chat
        ),
        selectedChat:
          state.selectedChat?._id === chatId ? updatedChat : state.selectedChat,
      }));

      toast.success("User removed from group successfully!");
    } catch (error) {
      console.error("Error removing user from group:", error);
      toast.error(error.response?.data?.message || "Failed to remove user");
    }
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.off) {
      console.warn(
        "Socket is not initialized or is not a valid socket instance."
      );
      return;
    }
    socket.off("newMessage");
  },

  setSelectedChat: (selectedChat) => {
    set({ selectedChat });
    get().subscribeToMessages(); // ✅ Automatically subscribe when chat is selected
  },

  toggleProfile: () =>
    set((state) => ({ isProfileOpen: !state.isProfileOpen })),
}));
