
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { Navigate, Outlet } from "react-router";
// import CommonLayout from "./components/common/CommonLayout"
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/common/Header";
import { cn } from "./lib/utils";
import useAuthStore from "./store/useAuthStore";
import { useState } from "react";
import { motion } from "motion/react";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="h-screen flex bg-zinc-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {/* <div className={cn("flex flex-col flex-1 hoverEffect max-w-[--breakpoint-2xl]", sidebarOpen ? "ml-64" : "ml-20")}> */}
        <motion.div className={cn("flex flex-col flex-1 hoverEffect max-w-[--breakpoint-2xl]")}
        initial={{ marginLeft: sidebarOpen ? 256 : 80 }}   // px values for ml-64 and ml-20
        animate={{ marginLeft: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        >
        {/* <div className={cn("flex flex-col flex-1 hoverEffect max-w-[--breakpoint-2xl]")} initial={{ marginLeft: sidebarOpen ? 256 : 80 }} // px values for ml-64 and ml-20 animate={{ marginLeft: sidebarOpen ? 256 : 80 }} transition={{ duration: 0.2, ease: "easeInOut" }} > */}
        <Header />
        <main>
          <Outlet />
        </main>
      </motion.div>
    </div >
  )
}

export default App

