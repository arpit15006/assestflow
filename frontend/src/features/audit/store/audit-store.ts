import { create } from "zustand";
import { AuditAsset, AuditOverview, TimelineEvent } from "@/shared/types";
import { AuditAPI } from "../services/mock-api";

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
    const data = await AuditAPI.getAudit();
    set({ overview: data.overview, assets: data.assets, timeline: data.timeline, isLoading: false });
  },

  verifyAsset: async (id, notes) => {
    const updated = await AuditAPI.verifyAsset(id, notes);
    const state = get();
    const assets = state.assets.map(a => a.id === id ? updated : a);
    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: "Asset Verified",
      description: `${updated.name} verified by Current User`,
      timestamp: new Date().toISOString(),
      type: "complete",
      actor: "Current User"
    };
    
    // Recalculate stats
    const stats = { verified: 0, missing: 0, damaged: 0, pending: 0 };
    assets.forEach(a => {
      if(a.verificationStatus === "verified") stats.verified++;
      else if(a.verificationStatus === "missing") stats.missing++;
      else if(a.verificationStatus === "damaged") stats.damaged++;
      else stats.pending++;
    });

    set({ 
      assets, 
      timeline: [event, ...state.timeline],
      overview: state.overview ? { ...state.overview, stats } : null
    });
  },

  markMissing: async (id, reason) => {
    const updated = await AuditAPI.markMissing(id, reason);
    const state = get();
    const assets = state.assets.map(a => a.id === id ? updated : a);
    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: "Asset Missing",
      description: `${updated.name} marked missing: ${reason}`,
      timestamp: new Date().toISOString(),
      type: "flag",
      actor: "Current User"
    };
    
    // Recalculate stats
    const stats = { verified: 0, missing: 0, damaged: 0, pending: 0 };
    assets.forEach(a => {
      if(a.verificationStatus === "verified") stats.verified++;
      else if(a.verificationStatus === "missing") stats.missing++;
      else if(a.verificationStatus === "damaged") stats.damaged++;
      else stats.pending++;
    });

    set({ 
      assets, 
      timeline: [event, ...state.timeline],
      overview: state.overview ? { ...state.overview, stats } : null
    });
  },

  markDamaged: async (id, details) => {
    const updated = await AuditAPI.markDamaged(id, details);
    const state = get();
    const assets = state.assets.map(a => a.id === id ? updated : a);
    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: "Asset Damaged",
      description: `${updated.name} marked damaged: ${details}`,
      timestamp: new Date().toISOString(),
      type: "damage",
      actor: "Current User"
    };
    
    // Recalculate stats
    const stats = { verified: 0, missing: 0, damaged: 0, pending: 0 };
    assets.forEach(a => {
      if(a.verificationStatus === "verified") stats.verified++;
      else if(a.verificationStatus === "missing") stats.missing++;
      else if(a.verificationStatus === "damaged") stats.damaged++;
      else stats.pending++;
    });

    set({ 
      assets, 
      timeline: [event, ...state.timeline],
      overview: state.overview ? { ...state.overview, stats } : null
    });
  },

  closeAudit: async () => {
    const closed = await AuditAPI.closeAudit();
    set({ overview: closed });
  },

  setFilter: (f) => set({ filter: f }),
}));
