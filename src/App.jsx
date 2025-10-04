import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Routes,Route} from "react-router"
import Navbar from './components/Navbar'
import Lostitems from './Pages/lostitems'
import Founditems from './Pages/founditems'
import Myreports from './Pages/myreports'
import Home from './Pages/home'
import Reportfound from './Pages/reportfound'
import Reportlost from './Pages/reportlost'
import Footer from './components/Footer'
import ItemDetails from './Pages/ItemDetails'
import Login from './Pages/Login'
import Signup from './Pages/signup'
import MyItems from './Pages/Myitems'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <main className='main-content'>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/lostitems" element={<Lostitems/>}/>
        <Route path="/founditems" element={<Founditems/>}/>
        <Route path="/myreports" element={<Myreports/>}/>
        <Route path="/reportfound" element={<Reportfound/>}/>
        <Route path="/reportlost" element={<Reportlost/>}/>
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/myitems" element={<MyItems />} />
      </Routes>
    </main>
    <Footer/>
    </>
  )
}

export default App
