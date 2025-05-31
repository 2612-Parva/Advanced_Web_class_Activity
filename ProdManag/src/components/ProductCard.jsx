// src/components/ProductCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.banner}
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text style={{ minHeight: "60px" }}>
          {product.description}
        </Card.Text>
        <h5 className="text-primary">${product.price}</h5>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;