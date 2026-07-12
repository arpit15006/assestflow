import { create } from "zustand";
import { AuditAsset, AuditOverview, TimelineEvent } from "@/shared/types";
import { auditApi } from "@/lib/api/audit";

interface AuditState {
  overview: AuditOverview | null;
  assets: AuditAsset[];
  timeline: TimelineEvent[];
  isLoading: boolean;
  selectedAsset: AuditAsset | null;
  filter: "all" | "missing" | "damaged" | "location_mismatch";
  fetchAudit: () => Promise<void>;
  verifyAsset: (id: string, notes?: string) => Promise<void>;
  markMissing: (id: string, reason: string) => Promise<void>;
  markDamaged: (id: string, details: string) => Promise<void>;
  closeAudit: () => Promise<void>;
  setFilter: (f: AuditState["filter"]) => void;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  overview: null,
  assets: [],
  timeline: [],
  isLoading: true,
  selectedAsset: null,
  filter: "all",

  fetchAudit: async () => {
    set({ isLoading: true });
    try {
      const data = await auditApi.getActive();
      if (data) {
        set({ overview: data.overview, assets: data.assets, timeline: data.timeline });
      }
    } catch (e) {
      console.error("Failed to fetch active audit", e);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyAsset: async (id, notes) => {
    try {
      await auditApi.updateItem(id, { verification: "VERIFIED", notes });
      await get().fetchAudit();
    } catch (e) {
      console.error("Failed to verify asset", e);
      throw e;
    }
  },

  markMissing: async (id, reason) => {
    try {
      await auditApi.updateItem(id, { verification: "MISSING", notes: reason });
      await get().fetchAudit();
    } catch (e) {
      console.error("Failed to mark asset missing", e);
      throw e;
    }
  },

  markDamaged: async (id, details) => {
    try {
      await auditApi.updateItem(id, { verification: "DAMAGED", notes: details });
      await get().fetchAudit();
    } catch (e) {
      console.error("Failed to mark asset damaged", e);
      throw e;
    }
  },

  closeAudit: async () => {
    try {
      await auditApi.close("active");
      await get().fetchAudit();
    } catch (e) {
      console.error("Failed to close audit", e);
      throw e;
    }
  },

  setFilter: (f) => set({ filter: f }),
}));
