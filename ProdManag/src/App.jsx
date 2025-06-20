import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import Contact from "./pages/Contact/Contact";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./pages/Auths/Signup";
import Login from "./pages/Auths/Login";


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
         <Route path="/product" element={<Product/>} />
         <Route path="/contact" element={<Contact/>}/>
         <Route path="/signup" element={<Signup/>}/>
         <Route path="/login" element={<Login/>} />


      </Routes>
    </Router>
    </>
  )
}

export default App;