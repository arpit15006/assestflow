"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { tableRowVariant } from "@/shared/lib/animations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { StatusBadge, SearchBar, FilterDropdown } from "@/shared/components";
import type { AuditAsset } from "@/shared/types";
import {
  MoreHorizontal,
  CheckCircle2,
  AlertTriangle,
  History,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { SectionCard } from "@/shared/components";

interface VerificationTableProps {
  data: AuditAsset[];
}

export function VerificationTable({ data }: VerificationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const departments = useMemo(() => {
    const depts = [...new Set(data.map((a) => a.department))];
    return depts.map((d) => ({
      label: d,
      value: d,
      count: data.filter((a) => a.department === d).length,
    }));
  }, [data]);

  const statuses = [
    { label: "Verified", value: "verified" },
    { label: "Missing", value: "missing" },
    { label: "Damaged", value: "damaged" },
    { label: "Pending", value: "pending" },
  ];

  const filteredData = useMemo(() => {
    let result = data;
    if (departmentFilter !== "all") {
      result = result.filter((a) => a.department === departmentFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.verificationStatus === statusFilter);
    }
    return result;
  }, [data, departmentFilter, statusFilter]);

  const columns: ColumnDef<AuditAsset>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
            className="border-zinc-200/60"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
            className="border-zinc-200/60"
          />
        ),
        enableSorting: false,
        size: 40,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 h-auto hover:bg-transparent text-zinc-500 font-medium text-xs gap-1"
          >
            Asset
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-medium text-zinc-950">{row.original.name}</p>
            <p className="text-[11px] text-zinc-500 font-mono">{row.original.assetTag}</p>
          </div>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: ({ getValue }) => (
          <span className="text-sm text-zinc-500">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "expectedLocation",
        header: "Expected Location",
        cell: ({ getValue }) => (
          <span className="text-sm text-zinc-500">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "actualLocation",
        header: "Actual Location",
        cell: ({ row }) => {
          const actual = row.original.actualLocation;
          const expected = row.original.expectedLocation;
          const mismatch = actual !== expected && actual !== "—";
          return (
            <span className={`text-sm ${mismatch ? "text-red-600" : "text-zinc-500"}`}>
              {actual}
            </span>
          );
        },
      },
      {
        accessorKey: "assignedEmployee",
        header: "Assigned To",
        cell: ({ getValue }) => (
          <span className="text-sm text-zinc-950">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "verificationStatus",
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue() as string} dot />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-muted rounded-lg"
                  aria-label={`Actions for ${row.original.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-40 bg-white border-zinc-200 rounded-xl p-1">
              <DropdownMenuItem className="gap-2 rounded-lg text-sm cursor-pointer">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                Verify
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg text-sm cursor-pointer">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                Flag Issue
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg text-sm cursor-pointer">
                <History className="h-3.5 w-3.5 text-zinc-500" />
                View History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 48,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, globalFilter, rowSelection },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <SectionCard
      title="Verification Table"
      subtitle={`${filteredData.length} assets · ${Object.keys(rowSelection).length} selected`}
      noPadding
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 pb-4">
        <SearchBar
          placeholder="Search assets, tags, employees..."
          value={globalFilter}
          onChange={setGlobalFilter}
          className="w-full sm:w-72"
        />
        <FilterDropdown label="Department" options={departments} value={departmentFilter} onChange={setDepartmentFilter} />
        <FilterDropdown label="Status" options={statuses} value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Table */}
      <div className="border-t border-zinc-200 overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-zinc-200/50 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-zinc-500 uppercase tracking-wider h-10 bg-zinc-50/50 first:pl-6 last:pr-6"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    custom={i}
                    variants={tableRowVariant}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -8 }}
                    className="border-zinc-200/50 hover:bg-zinc-50/40 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 first:pl-6 last:pr-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-zinc-500">
                    No assets found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200/50">
        <p className="text-xs text-zinc-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 w-8 p-0 rounded-lg"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Previous page</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="h-8 w-8 p-0 rounded-lg"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent>Next page</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </SectionCard>
  );
}
