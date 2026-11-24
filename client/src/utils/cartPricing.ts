
/* BPK-106: I put the cart calculations in one file
   so the modal and cart always use the same prices. */

import type { Product } from '../data/mockProducts'
import type { CartItem } from '../context/CartContext'

/* Find the selected size price and add any customizations. */
export function calculateUnitPrice(
  product: Product,
  selectedSize: string,
  selectedCustomizationIds: string[]
): number {

  /* Use the selected size price, or the regular
     product price if there are no size options. */
  const sizePrice = product.sizes?.find(
    (size) => size.name === selectedSize
  )?.price ?? product.price

  /* Add the prices of the customizations the customer picked. */
  const customizationTotal = (product.customizations ?? [])
    .filter((option) =>
      selectedCustomizationIds.includes(option.id)
    )
    .reduce((total, option) => total + option.price, 0)

  /* Round the final price to two decimal places. */
  return Math.round((sizePrice + customizationTotal) * 100) / 100
}

/* Multiply the unit price by the selected quantity. */
export function calculateLineSubtotal(
  unitPrice: number,
  quantity: number
): number {
  return Math.round(unitPrice * quantity * 100) / 100
}

/* Add each item's subtotal to get the full cart total. */
export function calculateCartTotal(items: CartItem[]): number {
  const total = items.reduce(
    (sum, item) =>
      sum + calculateLineSubtotal(item.unitPrice, item.quantity),
    0
  )

  return Math.round(total * 100) / 100
}

/* Show prices with a dollar sign and two decimal places. */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
