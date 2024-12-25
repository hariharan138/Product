import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Product.css';

const Product = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    const fetchData = async () => {
        try {
            const response = await axios.get("https://api.sampleapis.com/beers/ale");
            setData(response.data);
            setFilteredData(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const results = data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
        setCurrentPage(1);
    }, [searchTerm, data]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Get current items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="product-page">
            <header className="header">
                <h1>Beer Catalog</h1>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search beers..." 
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            </header>
            <main className="product-container">
                {currentItems.map((card, index) => (
                    <div key={index} className="product-card">
                        <div className="product-image-container">
                            <img 
                                src={card.image || "/placeholder.svg?height=200&width=200"} 
                                alt={card.name} 
                                className="product-image" 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                                }}
                            />
                        </div>
                        <h2 className="product-name">{card.name}</h2>
                        <p className="product-price">${(Math.random() * 10 + 5).toFixed(2)}</p>
                        <button className="add-to-cart">Add to Cart</button>
                    </div>
                ))}
            </main>
            <footer className="pagination">
                {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
                    <button 
                        key={i} 
                        onClick={() => paginate(i + 1)} 
                        className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </footer>
        </div>
    );
};

export default Product;

