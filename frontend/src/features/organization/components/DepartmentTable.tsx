"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  SortingState,
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
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Edit, Eye, Copy, Archive, Trash2, ArrowUpDown } from "lucide-react";
import { Department } from "../types";

interface DepartmentTableProps {
  data: Department[];
  onAction: (action: string, dept: Department) => void;
  searchQuery: string;
}

export function DepartmentTable({ data, onAction, searchQuery }: DepartmentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Filter local data based on search query
  const filteredData = React.useMemo(() => {
    return data.filter((dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const columnHelper = createColumnHelper<Department>();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 hover:bg-transparent text-xs font-semibold text-muted-foreground"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Department
            <ArrowUpDown className="ml-1.5 h-3 w-3" />
          </Button>
        ),
        cell: (info) => (
          <span className="font-semibold text-foreground text-sm">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("head", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Department Head</span>,
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("parentDept", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Parent Department</span>,
        cell: (info) => (
          <span className="text-sm text-muted-foreground">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Status</span>,
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge
              variant="outline"
              className={
                status === "Active"
                  ? "bg-green-500/10 text-green-700 border-green-200/50 hover:bg-green-500/10 font-medium"
                  : "bg-muted text-muted-foreground border-border hover:bg-muted font-medium"
              }
            >
              {status}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("employeesCount", {
        header: () => <span className="text-xs font-semibold text-muted-foreground">Employees Count</span>,
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="text-xs font-semibold text-muted-foreground text-right block">Actions</span>,
        cell: (info) => {
          const dept = info.row.original;
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
                  <DropdownMenuItem onClick={() => onAction("View", dept)} className="cursor-pointer">
                    <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Edit", dept)} className="cursor-pointer">
                    <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Duplicate", dept)} className="cursor-pointer">
                    <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => onAction("Archive", dept)} className="cursor-pointer">
                    <Archive className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    <span>Archive</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("Delete", dept)} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
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
                  <span className="text-sm font-semibold text-foreground">No departments yet.</span>
                  <span className="text-xs text-muted-foreground">Create your first department.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
