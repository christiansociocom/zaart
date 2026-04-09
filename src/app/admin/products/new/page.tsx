import React from 'react';
import ErrorBoundary from 'path-to-error-boundary';
import Debugger from 'path-to-debugger';
import ProductForm from './ProductForm';

const NewProductPage = () => {
  return (
    <ErrorBoundary>
      <Debugger>
        <ProductForm />
      </Debugger>
    </ErrorBoundary>
  );
};

export default NewProductPage;
