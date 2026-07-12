import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TopAsset, IdleAsset, MaintenanceItem, RetirementAsset } from "@/shared/types";

export const exportReportsCsv = async (
  topAssets: TopAsset[],
  idleAssets: IdleAsset[]
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // Export top assets as CSV
      const csvData = [
        ["Asset", "Department", "Utilization", "Bookings"],
        ...topAssets.map(a => [a.name, a.department, `${a.utilization}%`, a.bookings])
      ];
      const ws = XLSX.utils.aoa_to_sheet(csvData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Reports-Export.csv";
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    }, 800);
  });
};

export const exportReportsExcel = async (
  topAssets: TopAsset[],
  idleAssets: IdleAsset[],
  maintenanceDue: MaintenanceItem[],
  retirementAssets: RetirementAsset[]
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const wb = XLSX.utils.book_new();

      const topWs = XLSX.utils.json_to_sheet(topAssets.map(a => ({ Asset: a.name, Department: a.department, Utilization: `${a.utilization}%`, Bookings: a.bookings })));
      XLSX.utils.book_append_sheet(wb, topWs, "Top Assets");

      const idleWs = XLSX.utils.json_to_sheet(idleAssets.map(a => ({ Asset: a.name, Department: a.department, LastUsed: a.lastUsed, DaysIdle: a.daysIdle })));
      XLSX.utils.book_append_sheet(wb, idleWs, "Idle Assets");

      const maintWs = XLSX.utils.json_to_sheet(maintenanceDue.map(a => ({ Asset: a.asset, Type: a.type, DueDate: a.dueDate, Priority: a.priority, Status: a.status })));
      XLSX.utils.book_append_sheet(wb, maintWs, "Maintenance");

      XLSX.writeFile(wb, "Reports-Export.xlsx");
      resolve();
    }, 800);
  });
};

export const exportReportsPdf = async (
  kpis: any,
  topAssets: TopAsset[],
  idleAssets: IdleAsset[]
) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Analytics Report", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Total Assets: ${kpis.totalAssets}`, 14, 32);
      doc.text(`Utilization: ${kpis.utilization}%`, 14, 38);
      doc.text(`Maintenance Cost: $${kpis.maintenanceCost.toLocaleString()}`, 14, 44);

      autoTable(doc, {
        startY: 50,
        head: [['Top Assets', 'Department', 'Utilization', 'Bookings']],
        body: topAssets.map(a => [a.name, a.department, `${a.utilization}%`, a.bookings]),
      });

      autoTable(doc, {
        head: [['Idle Assets', 'Department', 'Last Used', 'Days Idle']],
        body: idleAssets.map(a => [a.name, a.department, a.lastUsed, a.daysIdle]),
      });

      doc.save("Reports-Export.pdf");
      resolve();
    }, 800);
  });
};
