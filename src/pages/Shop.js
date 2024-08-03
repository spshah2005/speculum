import React, { useState } from 'react';
import '../styles/shop.css'; // Import the CSS file for styling

export default function Shop() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update the state with the input value
    };

    return (
        <div className="shop-container">
            <h1>Welcome to the Shop</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button className="search-button">Search</button>
            </div>
        </div>
    );
}
