import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/utils/initials";
import { LayoutDashboard, Loader2, LogOut, User } from "lucide-react";
import { useRouter } from "next/router";
import { useGetProfile, useLogout } from "./AuthApi";

export function AuthDropdown() {
  const router = useRouter();
  const { data: user, isLoading } = useGetProfile();
  const { mutate } = useLogout();

  if (isLoading) {
    return <Loader2 className="animate-spin size-7 bg-gray-200" />;
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar
          src={user.image}
          alt={user.fullname}
          fallback={getInitials(user.fullname)}
          size="md"
          className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.fullname}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.email_verified && (
              <span className="text-xs text-green-600">✓ Verified</span>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
