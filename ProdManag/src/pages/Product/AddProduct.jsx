// src/components/AddProduct.jsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ProductModal from '../../components/ProductModal';

const AddProduct = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Product
      </Button>
      <ProductModal
        show={showModal}
        handleClose={handleClose}
        handleAddProduct={onAdd}
      />
    </>
  );
};

export default AddProduct;