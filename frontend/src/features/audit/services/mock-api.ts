import { AuditAsset, AuditOverview, TimelineEvent } from "@/shared/types";
import { auditAssets, auditOverview, auditTimeline } from "../data/mock-data";

export const AuditAPI = {
  getAudit: async (): Promise<{ overview: AuditOverview, assets: AuditAsset[], timeline: TimelineEvent[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ overview: auditOverview, assets: auditAssets, timeline: auditTimeline });
      }, 800);
    });
  },

  verifyAsset: async (assetId: string, notes?: string): Promise<AuditAsset> => {
    return new Promise((resolve) => setTimeout(() => {
      const asset = auditAssets.find(a => a.id === assetId);
      resolve({ ...asset, verificationStatus: "verified", notes } as AuditAsset);
    }, 600));
  },

  markMissing: async (assetId: string, reason: string): Promise<AuditAsset> => {
    return new Promise((resolve) => setTimeout(() => {
      const asset = auditAssets.find(a => a.id === assetId);
      resolve({ ...asset, verificationStatus: "missing", notes: reason } as AuditAsset);
    }, 600));
  },

  markDamaged: async (assetId: string, damageDetails: string): Promise<AuditAsset> => {
    return new Promise((resolve) => setTimeout(() => {
      const asset = auditAssets.find(a => a.id === assetId);
      resolve({ ...asset, verificationStatus: "damaged", notes: damageDetails } as AuditAsset);
    }, 600));
  },

  closeAudit: async (): Promise<AuditOverview> => {
    return new Promise((resolve) => setTimeout(() => {
      resolve({ ...auditOverview, status: "completed", progress: 100 });
    }, 1500));
  },

  generateReport: async (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 1200));
  }
};
