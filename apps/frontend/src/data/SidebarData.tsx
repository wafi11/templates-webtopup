import {
  CreditCard,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { ReactNode } from "react";

export type SidebarDataType = {
  name: string;
  link?: string;
  icon: ReactNode;
  children: SidebarDataType[];
};
export const SIDEBAR_DATA: SidebarDataType[] = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    children: [],
  },
  {
    name: "Products",
    icon: <Package className="w-5 h-5" />,
    children: [
      {
        name: "All Products",
        link: "/dashboard/products",
        icon: <Package className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Categories",
        link: "/dashboard/products/categories",
        icon: <Package className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Sub Products",
        link: "/dashboard/products/sub-products",
        icon: <Package className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Product Items",
        link: "/dashboard/products/items",
        icon: <Package className="w-4 h-4" />,
        children: [],
      },
    ],
  },
  {
    name: "Orders",
    link: "/dashboard/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    children: [],
  },
  {
    name: "Transactions",
    link: "/dashboard/transactions",
    icon: <CreditCard className="w-5 h-5" />,
    children: [],
  },
  {
    name: "Users",
    link: "/dashboard/users",
    icon: <Users className="w-5 h-5" />,
    children: [],
  },
  {
    name: "Reports",
    link: "/dashboard/reports",
    icon: <FileText className="w-5 h-5" />,
    children: [],
  },
  {
    name: "Settings",
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        name: "General",
        link: "/dashboard/settings/general",
        icon: <Settings className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Payment Gateway",
        link: "/dashboard/settings/payment",
        icon: <CreditCard className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Providers",
        link: "/dashboard/settings/providers",
        icon: <Package className="w-4 h-4" />,
        children: [],
      },
    ],
  },
];
