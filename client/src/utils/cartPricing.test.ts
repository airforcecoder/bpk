
/* BPK-108: I'm testing the cart prices so I can
   make sure the calculations work automatically. */

import { describe, it, expect } from 'vitest'
import type { Product } from '../data/mockProducts'
import {
  calculateUnitPrice,
  calculateLineSubtotal,
  formatPrice,
} from './cartPricing'

/* I made a test product with a paid customization
   so I can check the price calculations. */
const testProduct: Product = {
  id: 'test-001',
  name: 'Test Pudding',
  description: 'Product used for testing',
  imageRef: '/images/test.jpg',
  availability: 'available',
  price: 8,
  sizes: [
    { name: 'Mini', price: 8 },
    { name: 'Selfie', price: 15 },
  ],
  customizations: [
    { id: 'extra', name: 'Extra Topping', price: 2 },
  ],
}

describe('BPK-108: Cart pricing', () => {

  /* Check that selecting a size uses its price. */
  it('uses the selected size price', () => {
    expect(calculateUnitPrice(testProduct, 'Selfie', []))
      .toBe(15)
  })

  /* Check that paid customizations are included. */
  it('adds customization prices', () => {
    expect(calculateUnitPrice(testProduct, 'Mini', ['extra']))
      .toBe(10)
  })

  /* Check that quantity changes the subtotal. */
  it('calculates the correct subtotal', () => {
    expect(calculateLineSubtotal(10, 3))
      .toBe(30)
  })

  /* Check that prices display as US currency. */
  it('formats the price correctly', () => {
    expect(formatPrice(30))
      .toBe('$30.00')
  })
})
