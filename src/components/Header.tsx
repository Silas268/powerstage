import { useState } from "react";
import { Menu, X } from "lucide-react";
import "../styles/Header.css"; // Externe CSS-Datei
import React from "react";
import logo from "../assets/img.png";
import kebalogo from "../assets/keba.png";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);



    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="header">

            {/* Logo */}
            <div className="logo" >
                <img src={logo}  alt="Logo" />
                Endstufen-Datenbank
            </div>
            {/* Navigation Links (Desktop) */}
            <nav className={`nav ${isOpen ? "open" : ""}`}>
                <a href="/">Home</a>
                <a href="/">Endstufe</a>
            </nav>
            <div className="container">
            </div>

        </header>
    );
};

export default Header;
