import {
  CreditCard,
  FileText,
  Inspect,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  WalletCards,
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
        name: "Form-Fields",
        link: "/dashboard/products/form-fields",
        icon: <Inspect className="w-4 h-4" />,
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
    name: "Transactions",
    link: "/dashboard/transactions",
    icon: <CreditCard className="w-5 h-5" />,
    children: [
      {
        name: "Orders",
        link: "/dashboard/transactions/orders",
        icon: <ShoppingCart className="w-5 h-5" />,
        children: [],
      },
      {
        name: "Payment Methods",
        link: "/dashboard/transactions/payment-methods",
        icon: <Wallet className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Voucher",
        link: "/dashboard/transactions/vouchers",
        icon: <WalletCards className="w-4 h-4" />,
        children: [],
      },
    ],
  },
  {
    name: "Users",
    link: "/dashboard/users",
    icon: <Users className="w-5 h-5" />,
    children: [
      {
        name: "All Users",
        link: "/dashboard/users",
        icon: <Users className="w-4 h-4" />,
        children: [],
      },
      {
        name: "Log Balance",
        link: "/dashboard/users/log-balances",
        icon: <WalletCards className="w-4 h-4" />,
        children: [],
      },
    ],
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
