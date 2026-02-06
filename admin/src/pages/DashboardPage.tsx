// import React from 'react'

import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/useAuthStore"

const DashboardPage = () => {
  const {logout}=useAuthStore();

  return (
    <div>
      <Button variant={"destructive"} onClick={()=>logout()} >
        Logout
      </Button>
    </div>
  )
}

export default DashboardPage
