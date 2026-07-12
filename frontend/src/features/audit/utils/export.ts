import { AuditAsset, AuditOverview, TimelineEvent } from "@/shared/types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportCsv = async (assets: AuditAsset[]) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const csvData = [
        ["Asset", "Asset Tag", "Department", "Expected Location", "Actual Location", "Assigned Employee", "Status", "Notes"],
        ...assets.map(a => [
          a.name,
          a.assetTag,
          a.department,
          a.expectedLocation,
          a.actualLocation,
          a.assignedEmployee,
          a.verificationStatus,
          a.notes || ""
        ])
      ];
      const ws = XLSX.utils.aoa_to_sheet(csvData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Audit-Export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    }, 800);
  });
};

export const exportExcel = async (assets: AuditAsset[]) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const wsData = assets.map(a => ({
        Asset: a.name,
        "Asset Tag": a.assetTag,
        Department: a.department,
        "Expected Location": a.expectedLocation,
        "Actual Location": a.actualLocation,
        "Assigned Employee": a.assignedEmployee,
        Status: a.verificationStatus,
        Notes: a.notes || ""
      }));
      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Audit Data");
      XLSX.writeFile(wb, "Audit-Export.xlsx");
      resolve();
    }, 800);
  });
};

export const exportPdf = async (
  overview: AuditOverview, 
  assets: AuditAsset[],
  timeline: TimelineEvent[]
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Audit Report", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Title: ${overview.name}`, 14, 32);
      doc.text(`Department: ${overview.department}`, 14, 38);
      doc.text(`Progress: ${overview.progress}%`, 14, 44);
      doc.text(`Verified: ${overview.stats.verified} | Missing: ${overview.stats.missing} | Damaged: ${overview.stats.damaged}`, 14, 50);

      autoTable(doc, {
        startY: 60,
        head: [['Asset', 'Asset Tag', 'Department', 'Expected Location', 'Actual Location', 'Status']],
        body: assets.map(a => [
          a.name,
          a.assetTag,
          a.department,
          a.expectedLocation,
          a.actualLocation,
          a.verificationStatus
        ]),
      });

      doc.save("Audit-Report.pdf");
      resolve();
    }, 800);
  });
};
