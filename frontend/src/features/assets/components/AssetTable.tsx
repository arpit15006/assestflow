"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { MoreHorizontal, Edit, Eye, Copy, Archive, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Asset } from "../types";

interface AssetTableProps {
  data: Asset[];
  onAction: (action: string, asset: Asset) => void;
  searchQuery: string;
  filters: {
    category: string;
    status: string;
    department: string;
    location: string;
    condition: string;
  };
}

export function AssetTable({ data, onAction, searchQuery, filters }: AssetTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Filter local data based on search queries and select values
  const filteredData = React.useMemo(() => {
    return data.filter((asset) => {
      // Global Search
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

      // Filters
      const matchesCategory = filters.category === "all" || asset.category === filters.category;
      const matchesStatus = filters.status === "all" || asset.status === filters.status;
      const matchesDepartment = filters.department === "all" || asset.department === filters.department;
      const matchesLocation = filters.location === "all" || asset.location === filters.location;
      const matchesCondition = filters.condition === "all" || asset.condition === filters.condition;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDepartment &&
        matchesLocation &&
        matchesCondition
      );
    });
  }, [data, searchQuery, filters]);

  const columnHelper = createColumnHelper<Asset>();

  const getInitials = (name: string) => {
    if (!name || name === "--") return "AS";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = React.useMemo(
    () => [
      columnHelper.display({
        id: "image",
        header: () => <span className="sr-only">Thumbnail</span>,
        cell: (info) => {
          const asset = info.row.original;
          return (
            <Avatar className="h-8 w-8 rounded-lg border border-border">
              <AvatarFallback className="text-xxs bg-muted text-muted-foreground font-semibold rounded-lg">
                {getInitials(asset.name)}
              </AvatarFallback>
            </Avatar>
          );
        },
      }),
      columnHelper.accessor("assetTag", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Asset Tag</span>,
        cell: (info) => (
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 hover:bg-transparent text-xs font-semibold text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Asset Name
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: (info) => (
          <span className="font-semibold text-foreground text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("category", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Category</span>,
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Status</span>,
        cell: (info) => <AssetStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("department", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Department</span>,
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("assignedTo", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Assigned To</span>,
        cell: (info) => (
          <span
            className={`text-sm ${
              info.getValue() === "--" ? "text-muted-foreground italic" : "text-foreground font-medium"
            }`}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("location", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Location</span>,
        cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("lastUpdated", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Last Updated</span>,
        cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="text-xs font-semibold text-muted-foreground text-right block">Actions</span>,
        cell: (info) => {
          const asset = info.row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open actions</span>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-40 bg-popover border-border shadow-md">
                  <DropdownMenuItem onClick={() => onAction("View", asset)} className="cursor-pointer">
                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Edit", asset)} className="cursor-pointer">
                    <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Duplicate", asset)} className="cursor-pointer">
                    <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => onAction("Archive", asset)} className="cursor-pointer">
                    <Archive className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Delete", asset)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-3.5 w-3.5 text-destructive" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      }),
    ],
    [columnHelper, onAction]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border overflow-hidden bg-card transition-all duration-200">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 py-2 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5 px-4 font-normal text-sm align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-sm font-semibold text-foreground">No assets found.</span>
                    <span className="text-xs text-muted-foreground">Register your first asset.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 text-xs text-muted-foreground font-medium">
        <div>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredData.length
          )}{" "}
          of {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-2.5"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-2.5"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
