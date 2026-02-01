// import React from 'react'

import { cn } from "@/lib/utils" 

const Sidebar = () => {
  return (
    <aside className={cn("fixed w-64 inset-y-0 left-0 z-20 flex flex-col border-r border-r-slate-800/50 bg-linear-to-b from-slate-500 via-slate-800 to-900 shadow-2xl hoverEffect text-white")}>
      Sidebar
    </aside>
  )
}

export default Sidebar
