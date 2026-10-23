/* Import mock products */
import type { Product } from '../data/mockProducts'
import { useState } from 'react'

/* Import styling for the modal */
import './ProductDetailsModal.css'

/* Product we clicked, and close behavior as a modal */
type ProductDetailsModalProps = {
    product: Product
    onClose: () => void
}

/* Our function to pop up details on page */
function ProductDetailsModal({product, onClose} : ProductDetailsModalProps){
    

    /* Adding quantity to the pop up modal */
    const [quantity, setQuantity] = useState(1)
    const increaseQuantity = () => {setQuantity(quantity + 1)}
    const decreaseQuantity = () => {setQuantity(Math.max(1, quantity - 1))}

    /* Add sizes */
    const [selectedSize, setSelectedSize] = useState(
        product.sizes?.[0]?.name ?? ''
    )

    /* Adding price calculation */
    const size = product.sizes?.find(
        (option) => option.name === selectedSize
    )
        const unitPrice = size?.price ?? product.price
        const subtotal = unitPrice * quantity
        const formatPrice = (price: number) => price.toLocaleString('en-US', 
        {
        style: 'currency',
        currency: 'USD'
        })

    /* Adding image to the pop up modal */
    const [imageFailed, setImageFailed] = useState(false)

    return(
        <div className = "product-modal-backdrop">
            <section
                className = "product-modal"
                role = "dialog"
                aria-modal = "true"
                aria-labelledby = "product-modal-title"
                >
                    <button type = "button" onClick = {onClose}>
                        Close
                    </button>

                    <h2 id= "product-modal-title"> {product.name}</h2>

                    {/* Image for modal*/}
                    <div className="product-modal-image">
                        {product.imageRef && !imageFailed ? (
                            <img
                            src={`${import.meta.env.BASE_URL}${product.imageRef.replace(/^\/+/, '')}`}
                            alt={product.name}
                            onError={() => setImageFailed(true)}
                            />
                        ) : (
                            <p>Image coming soon</p>
                        )}
                        </div>

                        <p className="product-modal-description">
                        {product.description || 'Description coming soon.'}
                        </p>

                    <div className="product-modal-quantity">

                        {/*Modal quantity features */}
                        <span id="quantity-label">Quantity</span>

                        <div
                            className="product-modal-quantity-controls"
                            role="group"
                            aria-labelledby="quantity-label"
                        >
                            <button
                            type="button"
                            onClick={decreaseQuantity}
                            disabled={quantity === 1}
                            aria-label="Decrease quantity"
                            >
                            -
                            </button>

                            <span>{quantity}</span>

                            <button
                            type="button"
                            onClick={increaseQuantity}
                            aria-label="Increase quantity"
                            >
                            +
                            </button>
                        </div>
                    </div>

                    {/* Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                        <fieldset className="product-modal-sizes">
                            <legend>Choose a Size</legend>

                            {product.sizes.map((size) => (
                            <label key={size.name}>
                                <input
                                type="radio"
                                name="product-size"
                                value={size.name}
                                checked={selectedSize === size.name}
                                onChange={() => setSelectedSize(size.name)}
                                />

                                {size.name} — {formatPrice(size.price)}
                            </label>
                            ))}
                        </fieldset>
                        )}

                    {/* Price for the selected size */}
                        <p className="product-modal-price">
                        Unit Price: {formatPrice(unitPrice)}
                        </p>

                    {/* Price section */}
                    <div className="product-modal-subtotal">
                      <strong>Subtotal:</strong>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>

                    {/* Product availability */}
                    <p className="product-modal-availability">
                    {product.availability === 'available'
                        ? 'Available'
                        : 'Sold Out'}
                    </p>

                    {/* Cart functionality will be implemented later */}
                    <button
                    type="button"
                    className="btn btn-primary product-modal-cart"
                    disabled
                    >
                    Add to Cart
                    </button>

                </section>
        </div>
    )
}

export default ProductDetailsModal