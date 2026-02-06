import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TableFilters } from "@/components/layouts/TableFilters";
import { useState } from "react";
import { useFindAllUsers } from "../UsersApi";
import { TableUsers } from "../TableUsers";
import { PaginationComponents } from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function DashboardUserPage() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);
  const offset = (page - 1) * limit;

  const { data, isLoading } = useFindAllUsers({
    limit,
    offset,
    search: debouncedSearch || null,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Manage Users" />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="size-20 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Users">
        <TableFilters
          search={search}
          onSearchChange={handleSearchChange}
          limit={limit}
          onLimitChange={handleLimitChange}
          searchPlaceholder="Search by name or email..."
        />
      </DashboardHeader>

      <TableUsers users={data?.data.data || []} />

      {data?.data.meta && (
        <PaginationComponents
          onPageChange={setPage}
          pagination={data.data.meta}
        />
      )}
    </DashboardLayout>
  );
}
