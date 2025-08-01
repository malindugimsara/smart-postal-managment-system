import { Route, Routes } from "react-router-dom"
import HomePage from "./homePage.jsx";
import AboutPage from "./aboutPage";
import OrdersPage from "./OrdersPage";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
        <Header/>
        <div>
            <Routes path='/*'>
                <Route path="/*" element={<HomePage />} />
                <Route path="/home" element={<HomePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/orders" element={<OrdersPage/>}/>
            </Routes>
        </div>
        <Footer/>
    </div>
  )
}

export default Home