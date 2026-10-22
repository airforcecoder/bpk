/* Import mock products */
import type { Product } from '../data/mockProducts'

/* Import styling for the modal */
import './ProductDetailsModal.css'

/* Product we clicked, and close behavior as a modal */
type ProductDetailsModalProps = {
    product: Product
    onClose: () => void
}

/* Our function to pop up details on page */
function ProductDetailsModal({product, onClose} : ProductDetailsModalProps){
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

                </section>
        </div>
    )
}

export default ProductDetailsModal