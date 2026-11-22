
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

/* This is the information I send when adding
   a product from the modal to the cart. */
export type AddCartItemInput = {
  product: Product
  selectedSize: string
  customizations: CartItem['customizations']
  notes: string
  unitPrice: number
  quantity: number
}

/* For now, I only need to store items and add them.
   The other cart actions will come in later subtasks. */
type CartContextValue = {
  items: CartItem[]
  addItem: (item: AddCartItemInput) => void
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
