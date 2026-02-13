// import React from 'react'

import { cn } from "@/lib/utils"
import useAuthStore from "@/store/useAuthStore";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";
import { Bookmark, ChevronLeft, ChevronRight, FileText, Layers, LayoutDashboard, LogOut, Package, ShoppingBag, Tag, User, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
};

interface navItemsProps {
  to: string,
  icon: React.ReactNode,
  label: string,
  open: boolean,
  end?: boolean,
  pathname: string,
};

// const navigationItems = [{ to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true, },];

// Routes
const navigationItems = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/dashboard/account",
    icon: <User size={20} />,
    label: "Account",
  },
  {
    to: "/dashboard/users",
    icon: <Users size={20} />,
    label: "Users",
  },
  {
    to: "/dashboard/orders",
    icon: <Package size={20} />,
    label: "Orders",
  },
  {
    to: "/dashboard/invoices",
    icon: <FileText size={20} />,
    label: "Invoices",
  },
  {
    to: "/dashboard/banners",
    icon: <Layers size={20} />,
    label: "Banners",
  },
  {
    to: "/dashboard/products",
    icon: <ShoppingBag size={20} />,
    label: "Products",
  },
  {
    to: "/dashboard/categories",
    icon: <Tag size={20} />,
    label: "Categories",
  },
  {
    to: "/dashboard/brands",
    icon: <Bookmark size={20} />,
    label: "Brands",
  },
];


const Sidebar = ({ open, setOpen }: Props) => {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation(); //Active Link mark

  return (
    <motion.aside className={cn("fixed inset-y-0 left-0 z-20 flex flex-col border-r border-r-slate-800/50 bg-linear-to-b from-slate-500 via-slate-800 to-900 shadow-2xl hoverEffect text-white", open ? "w-64" : "w-15")}
      initial={{ width: open ? 256 : 80 }}
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4 h-16 bg-linear-to-r from-[#29beb3] via-slate-700 to-[#a96bde] border-b border-slate-600/50">
        <motion.div
          initial={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className={cn("flex items-center overflow-hidden", open ? "w-auto opacity-100" : "opacity-0")}
        >
          <h2 className="font-bold text-xl text-white drop-shadow-lg">BabyMart Admin</h2>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
          <Button
            onClick={() => setOpen(!open)}
            variant={"ghost"} size={"icon"} className="rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border-white/70 hover:border-white/50 hoverEffect">
            <motion.div
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {open ? <ChevronLeft /> : <ChevronRight className="rotate-180" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
      {/* Sidebar Content */}
      <div className="flex flex-col gap-1 flex-1 bg-linear-to-b from-slate-900 to-slate-800/50">
        {navigationItems?.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            open={open}
            end={item.end}
            pathname={pathname}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1 bg-linear-to-b from-slate-900 to-slate-800/50 overflow-hidden">
        <motion.div className={cn("flex items-center gap-3 px-3 mb-3", open ? "justify-start" : "justify-center")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div>
            {user?.avatar ? <img src={user?.avatar} alt="img" className="h-full w-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {open && <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs font-medium text-green-400  capitalize">{user?.role}</p>
            </motion.div>}
          </AnimatePresence>

        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant={"outline"} size={open ? "default" : "icon"}
            onClick={logout}
            className="w-full border-red-500/30 hover:bg-red-600/20 hover:border-red-400/50 text-red-400 hover:text-white transition-colors bg-red-600/10 backdrop-blur-sm"
          >
            <LogOut size={16} className={cn("mr-2", !open && "mr-0")} />
            {open && "Logout"}
          </Button>
        </motion.div>
      </div>
    </motion.aside>
  )
};

// sidebar items
function NavItem({ to, icon, label, open, end, pathname }: navItemsProps) {
//   // console.log("items", item);
  return <NavLink
  to={to}
  end={end}
  className={cn("flex items-center gap-2 p-3 rounded-xl text-sm font-medium hoverEffect overflow-hidden text-white/80 hover:bg-linear-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:text-white hover:shadow-lg hover:backdrop-blur-sm", pathname === to ? "bg-linear-to-r from-slate-700/50 to-slate-600/50 text-teal-500 shadow-lg backdrop-blur-sm" : "hover:scale-102")} >
    <span>{icon}</span>{open && label}
  </NavLink>
}

export default Sidebar
