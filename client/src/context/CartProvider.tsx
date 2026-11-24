
/* BPK-104: I keep the cart here so it doesn't reset
   when someone moves between Home, Menu, and Cart. */

import { useState, type ReactNode } from 'react'
import {
  CartContext,
  type CartItem,
  type AddCartItemInput,
} from './CartContext'

/* BPK-106: Use the shared pricing functions. */
import {
  calculateUnitPrice,
  calculateCartTotal,
} from '../utils/cartPricing'

export function CartProvider({ children }: { children: ReactNode }) {

  /* Start with an empty cart. */
  const [items, setItems] = useState<CartItem[]>([])

/* BPK-104: Add the customer's selected product to the cart. */
function addItem({
  product,
  selectedSize,
  customizations,
  notes,
  quantity,
}: AddCartItemInput) {

    /* I don't want customers adding sold-out products. */
    if (product.availability !== 'available') return

    /* Make sure the quantity is at least 1. */
    const safeQuantity = Math.max(1, Math.floor(quantity))

    /* Remove extra spaces from the customer's notes. */
    const cleanNotes = notes.trim()

    /* I use the product and its selected options to make
       an ID. Different choices should stay separate. */
    const id = JSON.stringify([
      product.id,
      selectedSize,
      customizations.map((option) => option.id).sort(),
      cleanNotes,
    ])

    /* BPK-106: Calculate the unit price using the
   product size and any customizations selected. */
    const unitPrice = calculateUnitPrice(
      product,
      selectedSize,
      customizations.map((option) => option.id)
    )

    /* Update the cart using the items already there. */
    setItems((current) => {

      /* First, check if this same selection is in the cart. */
      const existing = current.find((item) => item.id === id)

      /* If it already exists, just increase the quantity. */
      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        )
      }

      /* Otherwise, add it as a new item.
         I save the size, customizations, notes, and price. */
      return [
        ...current,
        {
          id,
          productId: product.id,
          productName: product.name,
          imageRef: product.imageRef,
          selectedSize,
          customizations,
          notes: cleanNotes,
          unitPrice,
          quantity: safeQuantity,
        },
      ]
    })
  }


/* BPK-105: This lets me change the quantity
   of an item that's already in the cart. */
function updateQuantity(id: string, quantity: number) {

  /* I don't want the quantity to go below 1. */
  const newQuantity = Math.max(1, Math.floor(quantity))

  /* Find the matching item and update its quantity. */
  setItems((current) =>
    current.map((item) =>
      item.id === id
        ? { ...item, quantity: newQuantity }
        : item
    )
  )
}

/* BPK-105: Remove the item the customer selected. */
function removeItem(id: string) {

  /* Keep every item except the one being removed. */
  setItems((current) =>
    current.filter((item) => item.id !== id)
  )
}

/* BPK-106: Add the subtotals of all cart items.
   This recalculates whenever the cart state changes. */
const cartTotal = calculateCartTotal(items) 


   /* BPK-106: Share the cart items, functions, and total
     so the other pages can use them. */
  return (
<CartContext.Provider
  value={{
    items,
    addItem,
    updateQuantity,
    removeItem,
    cartTotal,
  }}
>
      {children}
    </CartContext.Provider>
  )
}
