/* Import mock products */
import type { Product } from '../data/mockProducts'

/* Updated import for keyboard support */
import { useEffect, useRef, useState } from 'react'

/* Import styling for the modal */
import './ProductDetailsModal.css'

/* Product we clicked, and close behavior as a modal */
type ProductDetailsModalProps = {
    product: Product
    onClose: () => void
}

/* Our function to pop up details on page */
function ProductDetailsModal({product, onClose} : ProductDetailsModalProps){


/* Modal keyboard accessibility */
const modalRef = useRef<HTMLElement>(null)
const closeButtonRef = useRef<HTMLButtonElement>(null)
useEffect(() => {
  const previousFocus = document.activeElement
  // Focus the Close button when the modal opens
  closeButtonRef.current?.focus()
  const handleKeyDown = (event: KeyboardEvent) => {
    // Close the modal with Escape
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    // Keep Tab navigation inside the modal
    if (event.key !== 'Tab') return
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!modalRef.current?.contains(document.activeElement)) {
        event.preventDefault()
        if (event.shiftKey) {
            last.focus()
        } else {
            first.focus()
        }
        } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
        }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
        document.removeEventListener('keydown', handleKeyDown)
        // Return focus to the Product Card when the modal closes
        if (previousFocus instanceof HTMLElement) {
        previousFocus.focus()
        }
    }
    }, [onClose])
    

    /* Adding quantity to the pop up modal */
    const [quantity, setQuantity] = useState(1)
    const increaseQuantity = () => {setQuantity(quantity + 1)}
    const decreaseQuantity = () => {setQuantity(Math.max(1, quantity - 1))}

    /* Add instructions */
    const [notes, setNotes] = useState('')
    

    /* Add sizes */
    const [selectedSize, setSelectedSize] = useState(
        product.sizes?.[0]?.name ?? ''
    )
    
    /* Customer's selected customizations */
    const [selectedCustomizations, setSelectedCustomizations] =
    useState<string[]>([])

    /* Adding price calculation */
    const size = product.sizes?.find(
        (option) => option.name === selectedSize
    )
        const unitPrice = size?.price ?? product.price
        const customizationTotal = (product.customizations ?? [])
        .filter((option) => selectedCustomizations.includes(option.id))
        .reduce((total, option) => total + option.price, 0)
        const subtotal = (unitPrice + customizationTotal) * quantity
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
                    {/* Button updated for close with keyboard behavior */}
                    <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    >
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

                    {/* Product customizations */}
                    {product.customizations && product.customizations.length > 0 && (
                    <fieldset className="product-modal-customizations">
                        <legend>Customizations</legend>

                        {product.customizations.map((option) => (
                        <label key={option.id}>
                            <input
                            type="checkbox"
                            checked={selectedCustomizations.includes(option.id)}
                            onChange={(e) => {
                                setSelectedCustomizations((current) =>
                                e.target.checked
                                    ? [...current, option.id]
                                    : current.filter((id) => id !== option.id)
                                )
                            }}
                            />

                            {option.name}
                            {option.price > 0 && ` (+${formatPrice(option.price)})`}
                        </label>
                        ))}
                    </fieldset>
                    )}
                        {/* Customer special instructions */}
                        <div className="product-modal-notes">
                        <label htmlFor="product-notes">
                            Important Notes
                        </label>

                        <textarea
                            id="product-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter any special instructions..."
                            maxLength={250}
                            rows={3}
                        />
                        </div>

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