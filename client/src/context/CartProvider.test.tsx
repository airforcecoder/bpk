
/* @vitest-environment jsdom */

/* BPK-108: I'm testing the cart functions to make sure
   adding, changing, and removing products works correctly. */

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { Product } from '../data/mockProducts'
import { CartProvider } from './CartProvider'
import { useCart } from './CartContext'

/* Make a product I can use for testing. */
const product: Product = {
  id: 'test-001',
  name: 'Test Pudding',
  description: 'Cart testing product',
  price: 8,
  imageRef: '/images/test.jpg',
  availability: 'available',
  sizes: [
    { name: 'Mini', price: 8 },
    { name: 'Selfie', price: 15 },
  ],
  customizations: [
    { id: 'extra', name: 'Extra Topping', price: 2 },
  ],
}

/* I use these buttons to test my CartProvider
   without needing to open the entire website. */
function TestCart() {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    cartTotal,
  } = useCart()

  return (
    <div>
      <button onClick={() => addItem({
        product,
        selectedSize: 'Mini',
        customizations: [],
        notes: '',
        quantity: 2,
      })}>
        Add Mini
      </button>

      <button onClick={() => addItem({
        product,
        selectedSize: 'Selfie',
        customizations: [],
        notes: '',
        quantity: 1,
      })}>
        Add Selfie
      </button>

      <button onClick={() => addItem({
        product,
        selectedSize: 'Mini',
        customizations: [product.customizations![0]],
        notes: '',
        quantity: 1,
      })}>
        Add Extra Topping
      </button>

      <button onClick={() => addItem({
        product,
        selectedSize: 'Mini',
        customizations: [],
        notes: 'No bananas',
        quantity: 1,
      })}>
        Add With Notes
      </button>

      <button onClick={() => addItem({
        product: { ...product, availability: 'unavailable' },
        selectedSize: 'Mini',
        customizations: [],
        notes: '',
        quantity: 1,
      })}>
        Add Sold Out
      </button>

      <button onClick={() => {
        if (items[0]) {
          updateQuantity(items[0].id, items[0].quantity + 1)
        }
      }}>
        Increase
      </button>

      <button onClick={() => {
        if (items[0]) {
          updateQuantity(items[0].id, items[0].quantity - 1)
        }
      }}>
        Decrease
      </button>

      <button onClick={() => {
        if (items[0]) removeItem(items[0].id)
      }}>
        Remove
      </button>

      {/* Show the cart values so my tests can check them. */}
      <span data-testid="rows">{items.length}</span>
      <span data-testid="quantity">
        {items.reduce((sum, item) => sum + item.quantity, 0)}
      </span>
      <span data-testid="total">{cartTotal}</span>
    </div>
  )
}

/* Render each test with a new empty cart. */
function setup() {
  render(
    <CartProvider>
      <TestCart />
    </CartProvider>
  )
}

afterEach(cleanup)

describe('BPK-108: Cart functionality', () => {

  /* Check that adding a product saves its quantity and price. */
  it('adds a product to the cart', () => {
    setup()

    fireEvent.click(screen.getByText('Add Mini'))

    expect(screen.getByTestId('rows').textContent).toBe('1')
    expect(screen.getByTestId('quantity').textContent?.trim()).toBe('2')
    expect(screen.getByTestId('total').textContent).toBe('16')
  })

  /* Adding the same selection should increase quantity. */
  it('combines identical selections', () => {
    setup()

    fireEvent.click(screen.getByText('Add Mini'))
    fireEvent.click(screen.getByText('Add Mini'))

    expect(screen.getByTestId('rows').textContent).toBe('1')
    expect(screen.getByTestId('quantity').textContent?.trim()).toBe('4')
  })

  /* Different options should create different cart rows. */
  it('keeps different selections separate', () => {
    setup()

    fireEvent.click(screen.getByText('Add Mini'))
    fireEvent.click(screen.getByText('Add Selfie'))
    fireEvent.click(screen.getByText('Add Extra Topping'))
    fireEvent.click(screen.getByText('Add With Notes'))

    expect(screen.getByTestId('rows').textContent).toBe('4')
    expect(screen.getByTestId('total').textContent).toBe('49')
  })

  /* Quantity should never go below 1. */
  it('updates quantity and keeps the minimum at 1', () => {
    setup()

    fireEvent.click(screen.getByText('Add Mini'))
    fireEvent.click(screen.getByText('Decrease'))
    fireEvent.click(screen.getByText('Decrease'))

    expect(screen.getByTestId('quantity').textContent?.trim()).toBe('1')
    expect(screen.getByTestId('total').textContent).toBe('8')

    fireEvent.click(screen.getByText('Increase'))

    expect(screen.getByTestId('total').textContent).toBe('16')
  })

  /* Removing the last item should leave an empty cart. */
  it('removes a product and updates the total', () => {
    setup()

    fireEvent.click(screen.getByText('Add Mini'))
    fireEvent.click(screen.getByText('Remove'))

    expect(screen.getByTestId('rows').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0')
  })

  /* Sold-out products should not be added. */
  it('blocks unavailable products', () => {
    setup()

    fireEvent.click(screen.getByText('Add Sold Out'))

    expect(screen.getByTestId('rows').textContent).toBe('0')
  })
})
