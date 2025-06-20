import React from 'react';
import { Card } from 'react-bootstrap';
import laptopImg from "../assets/laptop.jpg";
import phoneImg from "../assets/phone.jpg";
import testProductImg from "../assets/computer.jpg";


const ProductCard = ({ product }) => {
  const getProductImage = () => {
    const productName = product.name.toLowerCase();
    
    if (productName.includes('laptop')) return laptopImg;
    if (productName.includes('phone')) return phoneImg;
    return testProductImg; 
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={getProductImage()}
        alt={product.name}
        style={{ 
          height: '200px', 
          objectFit: 'cover',
          backgroundColor: '#f8f9fa'
        }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text style={{ minHeight: "60px" }}>
          {product.description}
        </Card.Text>
        <h5 className="text-primary">${product.price.toFixed(2)}</h5>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;