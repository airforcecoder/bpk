
/* BPK-104: This file defines what I need to store
   in the cart and what actions I can use. */

import { createContext, useContext } from 'react'
import type { Product } from '../data/mockProducts'

/* Each item needs to remember the product and
   everything the customer selected in the modal. */
export type CartItem = {
  id: string
  productId: string
  productName: string
  imageRef: string
  selectedSize: string
  customizations: {
    id: string
    name: string
    price: number
  }[]
  notes: string
  unitPrice: number
  quantity: number
}

/* BPK-106: The provider will calculate the price,
   so I don't need to send it from the modal anymore. */
export type AddCartItemInput = {
  product: Product
  selectedSize: string
  customizations: CartItem['customizations']
  notes: string
  quantity: number
}


/* BPK-105: I added two more functions so customers
   can change quantities and remove items from the cart. */
/* BPK-106: Add the total so the Cart page
   can show the price of everything selected. */
type CartContextValue = {
  items: CartItem[]
  addItem: (item: AddCartItemInput) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  cartTotal: number
}


/* Create a place for the cart data to be shared. */
export const CartContext =
  createContext<CartContextValue | null>(null)

/* I can use this function to access the cart
   from any component inside CartProvider. */
export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
