import React from 'react';
import './ProductCard.css'; // Assuming a CSS file for styles

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            {product.featured && <span className="featured-badge">Featured</span>}
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <p className="variants-count">Variants: {product.variantsCount}</p>
            <div className="action-buttons">
                <button className="edit-button">Edit</button>
                <button className="view-button">View</button>
            </div>
        </div>
    );
};

export default ProductCard;