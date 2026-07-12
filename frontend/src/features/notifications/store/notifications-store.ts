import { create } from "zustand";
import { Notification } from "@/shared/types";
import { NotificationsAPI } from "../services/mock-api";

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  searchQuery: string;
  activeTab: string;
  
  fetchNotifications: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
  
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  
  addSimulatedNotification: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  isLoading: true,
  searchQuery: "",
  activeTab: "all",

  fetchNotifications: async () => {
    set({ isLoading: true });
    const data = await NotificationsAPI.getNotifications();
    set({ notifications: data, isLoading: false });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  markRead: async (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
    await NotificationsAPI.markRead(id);
  },

  markAllRead: async () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
    await NotificationsAPI.markAllRead();
  },

  deleteNotification: async (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
    await NotificationsAPI.deleteNotification(id);
  },

  addSimulatedNotification: () => {
    const newNotif = NotificationsAPI.simulateIncomingNotification();
    set(state => ({
      notifications: [newNotif, ...state.notifications]
    }));
  }
}));
