import { Notification } from "@/shared/types";
import { notifications } from "../data/mock-data";

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const NotificationsAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(600);
    return [...notifications];
  },
  
  markRead: async (id: string): Promise<void> => {
    await delay(200);
  },

  markAllRead: async (): Promise<void> => {
    await delay(400);
  },

  archiveNotification: async (id: string): Promise<void> => {
    await delay(300);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await delay(300);
  },

  approveRequest: async (id: string): Promise<void> => {
    await delay(500);
  },

  rejectRequest: async (id: string): Promise<void> => {
    await delay(500);
  },

  savePreferences: async (prefs: any): Promise<void> => {
    await delay(600);
  },

  simulateIncomingNotification: (): Notification => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      type: "booking",
      title: "New Asset Booking Request",
      description: "A new booking request has been submitted for Conference Room B.",
      timestamp: new Date().toISOString(),
      read: false,
      priority: "medium",
      actor: { name: "System Demo", avatar: "" },
    };
  }
};
