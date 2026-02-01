
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import CommonLayout from "./components/common/CommonLayout"
import { Button } from "./components/ui/button"

function App() {

  return (
    <div>
      <CommonLayout>
        <h2>Admin Panel</h2>
        <p>Baby mart E-commerce</p>
        <Button className="text-2xl p-5 hover:bg-gray-300 hover:text-black transition duration-200">Button</Button>
      </CommonLayout>
    </div>
  )
}

export default App

