// other imports
import React from 'react';

function ProductForm() {
    // ...
    return (
        <form>
            {/* form fields */}
            <input type="text" name="title" />
            <input type="text" name="description" />
            {/* images array assured formatting */}
            const formattedImages = Array.isArray(images) && images.length > 0 ? images : [];
            // ...
        </form>
    );
}

export default ProductForm;