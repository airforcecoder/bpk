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

                </section>
        </div>
    )
}

export default ProductDetailsModal