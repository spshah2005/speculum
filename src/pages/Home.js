import React, { useState, useEffect } from 'react'
import '../styles/home.css'
import {Link} from 'react-router-dom'

export default function Home(){
    const [opacity, setOpacity] = useState(1); // State for main text opacity

    const handleScroll = () => {
        const scrolled = window.scrollY;
        
        // Calculate opacity for the main description
        const newOpacity = Math.max(1 - scrolled / 400, 0); // Fade out main description
        setOpacity(newOpacity);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="hero">
            <h1 className="hero-title" style={{ opacity: opacity }}>speculum</h1>
            <p className="hero-description" style={{ opacity: opacity }}>a mirror reflecting your style.</p>
            <Link to="/shop" className="peek-description" 
            style={{ opacity: Math.min(1-opacity, 1), textDecoration:"none", color:"black"}}>
                take a peek through the looking glass
            </Link>
        </div>
    );
}