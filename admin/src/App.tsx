
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import { Navigate, Outlet } from "react-router";
// import CommonLayout from "./components/common/CommonLayout"
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/common/Header";
import { cn } from "./lib/utils";
import useAuthStore from "./store/useAuthStore";

function App() {
  const isAuthenticated = useAuthStore();

  if(!isAuthenticated) {
    return <Navigate to={"/login"} />
  }

  return (
    <div className="h-screen flex bg-zinc-100">
      <Sidebar />
      <div className={cn("flex flex-col bg-red-200 flex-1 hoverEffect max-w-[--breakpoint-2xl] ml-64")}>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App

