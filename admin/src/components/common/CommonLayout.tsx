// import React from 'react'

import Header from "./Header"

const CommonLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <Header />
      {children}
    </>
  )
}

export default CommonLayout
