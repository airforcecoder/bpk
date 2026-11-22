
/* BPK-105: I made the cart page functional so customers
   can review their items, change quantities, or remove them. */

import { Link } from 'react-router'
import { useCart } from '../context/CartContext'
import './CartPage.css'

function CartPage() {

  /* Get the cart items and functions from shared state. */
  const { items, updateQuantity, removeItem } = useCart()

  /* Display prices as dollars with two decimal places.
     I'll move the shared pricing into BPK-106. */
  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })

  return (
    <main className="page-container cart-page">

      <h1 className="cart-page__title">Your Cart</h1>

      {/* Show this message when there is nothing in the cart. */}
      {items.length === 0 ? (
        <div className="cart-page__empty">
          <h2>Your cart is empty!</h2>
          <p>Check out our menu and add some pudding.</p>

          <Link to="/menu" className="btn btn-primary">
            View Menu
          </Link>
        </div>
      ) : (
        <div className="cart-page__items">

          {/* Go through each item saved in the cart. */}
          {items.map((item) => (

            <article className="cart-item" key={item.id}>

              {/* Show the product image if one is available. */}
              {item.imageRef && (
                <img
                  className="cart-item__image"
                  src={`${import.meta.env.BASE_URL}${item.imageRef.replace(/^\/+/, '')}`}
                  alt={item.productName}
                />
              )}

              <div className="cart-item__details">

                {/* Show the product name and selected size. */}
                <h2>{item.productName}</h2>

                {item.selectedSize && (
                  <p>Size: {item.selectedSize}</p>
                )}

                {/* Show any customizations the customer selected. */}
                {item.customizations.length > 0 && (
                  <div>
                    <p>Customizations:</p>
                    <ul>
                      {item.customizations.map((option) => (
                        <li key={option.id}>
                          {option.name}
                          {option.price > 0 &&
                            ` (+${formatPrice(option.price)})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keep the customer's special instructions. */}
                {item.notes && (
                  <p>Notes: {item.notes}</p>
                )}

                {/* Show the price for one pudding with its options. */}
                <p>Unit Price: {formatPrice(item.unitPrice)}</p>

                {/* BPK-105: Let the customer increase or
                    decrease the quantity without going below 1. */}
                <div
                  className="cart-item__quantity"
                  role="group"
                  aria-label={`Quantity for ${item.productName}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity === 1}
                    aria-label={`Decrease ${item.productName} quantity`}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label={`Increase ${item.productName} quantity`}
                  >
                    +
                  </button>
                </div>

                {/* Show the price for this item and its quantity.
                    I'll reuse the shared calculation in BPK-106. */}
                <p className="cart-item__subtotal">
                  Subtotal: {formatPrice(item.unitPrice * item.quantity)}
                </p>

                {/* Remove this selection without affecting
                    the other items in the cart. */}
                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.productName} from cart`}
                >
                  Remove
                </button>

              </div>
            </article>
          ))}

          {/* Give customers a way to keep shopping. */}
          <Link to="/menu" className="btn btn-primary">
            Continue Shopping
          </Link>

        </div>
      )}
    </main>
  )
}

export default CartPage
