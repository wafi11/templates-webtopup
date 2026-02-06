import { useState } from "react";
import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useFindAllOrder } from "./OrderApi";
import { TableOrder } from "./TableOrder";
import { PaginationComponents } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function OrderDashboard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setDebouncedSearch(value);
  };
  const debounce = useDebounce(debouncedSearch, 500);

  const offset = (page - 1) * limit;

  const { data, isLoading } = useFindAllOrder({
    limit,
    offset,
    search: debounce || null,
  });

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1); // Reset ke page 1
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Orders">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Limit Dropdown */}
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="25">25 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
              <SelectItem value="100">100 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardHeader>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <TableOrder orders={data?.data.data || []} />

          {data?.data.meta && (
            <div className="mt-4">
              <PaginationComponents
                onPageChange={handlePageChange}
                pagination={data.data.meta}
              />
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
