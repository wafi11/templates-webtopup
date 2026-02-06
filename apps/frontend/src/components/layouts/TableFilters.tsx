import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

interface TableFiltersProps {
  withSearch?: boolean;
  withLimit?: boolean;
  withButtonCreate?: boolean;
  hrefCreate?: string;
  searchPlaceholder?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  limit?: number;
  onLimitChange?: (value: number) => void;
  limitOptions?: number[];
}

export function TableFilters({
  withSearch = true,
  withLimit = true,
  withButtonCreate = false,
  hrefCreate,
  searchPlaceholder = "Search...",
  search = "",
  onSearchChange,
  limit = 10,
  onLimitChange,
  limitOptions = [5, 10, 25, 50, 100],
}: TableFiltersProps) {
  return (
    <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
      {/* Search & Limit Container */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        {withSearch && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {/* Limit Dropdown */}
        {withLimit && (
          <Select
            value={limit.toString()}
            onValueChange={(v) => onLimitChange?.(Number(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {limitOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Create Button */}
      {withButtonCreate && hrefCreate && (
        <Button asChild>
          <Link href={hrefCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      )}
    </div>
  );
}
