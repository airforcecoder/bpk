export type ProductAvailability = 'available' | 'unavailable'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageRef: string
  availability: ProductAvailability
  sizes?: {
    name: string
    price: number
  }[]
  customizations?: {
    id: string
    name: string
    price: number
  }[]
}

/**
 * BPK demo product catalog based on previously published public menu listings.
 * NOT a final client-approved menu: confirm products, prices, sizes and
 * availability with Kendra before deploying. Availability below is for
 * UI preview/testing only, not live inventory.
 *
 * Biscoff and Nutter Butter Oreo photo matches are provisional.
 * Unidentified pie photos are intentionally not represented as products.
 * Existing OG Nilla size prices/customization were preserved from the
 * team's existing mock data, even where public listings differed.
 */
export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'OG Nilla',
    description: 'Fluffy vanilla pudding with bananas, vanilla wafers and a Chessmen cookie on top.',
    price: 8,
    imageRef: '/images/og-nilla.jpg',
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 8 },
      { name: 'Selfie (16oz)', price: 15 },
      { name: '1 dozen 3oz Party cups', price: 36 },
      { name: 'Usie (8"x8" Pan)', price: 30 },
      { name: 'Family (9"x9" Pan)', price: 40 },
      { name: 'Party (9"x13" Pan)', price: 50 },
      { name: 'Party Plus (Feeds 15-20)', price: 60 },
    ],
    customizations: [
      { id: 'no-banana', name: 'No Banana', price: 0 },
    ],
  },
  {
    id: 'prod-002',
    name: 'Biscoff',
    description: 'Vanilla pudding layered with fresh bananas and Biscoff cookies.',
    price: 9,
    imageRef: '/images/biscoff.jpg', // PROVISIONAL PHOTO MATCH: verify with Kendra
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 9 },
      { name: 'Selfie (16oz)', price: 15 },
      { name: 'Usie (8"x8" Pan)', price: 35 },
    ],
  },
  {
    id: 'prod-003',
    name: 'Chocolate Oreo Blast',
    description: 'Chocolate pudding layered with Oreos and bananas.',
    price: 9,
    imageRef: '/images/chocolate-oreo-blast.jpg',
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 9 },
      { name: 'Selfie (16oz)', price: 15 },
    ],
  },
  {
    id: 'prod-004',
    name: 'Blueberry Lemon Drop',
    description: 'Lemon pudding layered with buttery cookie crumbs and blueberry compote.',
    price: 9,
    imageRef: '/images/blueberry-lemon-drop.jpg',
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 9 },
    ],
  },
  {
    id: 'prod-005',
    name: 'Krazy Circus Cookie',
    description: 'Creamy vanilla pudding, bananas, crunchy frosted animal cookies and sprinkles.',
    price: 9,
    imageRef: '/images/krazy-circus-cookie.jpg',
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 9 },
    ],
  },
  {
    id: 'prod-006',
    name: 'Peach Crumbler',
    description: 'Vanilla pudding layered with cookie crumbs and peach cobbler filling.',
    price: 7,
    imageRef: '/images/peach-crumbler.jpg',
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 7 },
      { name: 'Selfie (16oz)', price: 15 },
    ],
  },
  {
    id: 'prod-007',
    name: 'Nutter Butter Oreo',
    description: 'Peanut butter pudding with bananas, Nutter Butter cookies and Oreos.',
    price: 9,
    imageRef: '/images/nutter-butter-oreo.jpg', // PROVISIONAL PHOTO MATCH: verify with Kendra
    availability: 'available',
    sizes: [
      { name: 'Mini (8oz)', price: 9 },
      { name: 'Selfie (16oz)', price: 15 },
    ],
  },
]
