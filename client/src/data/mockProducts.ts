export type ProductAvailability = "available" | "unavailable";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageRef: string;
  availability: ProductAvailability;
  /* Added sizes to options */
  sizes?: {
  name: string
  price: number
}[]
}

export const mockProducts: Product[] = [

  {
  id: "prod-001",
  name: "OG Nilla",
  description: "TODO: Add Kendra's approved description",
  price: 8,
  imageRef: "/images/og-nilla.jpg",
  availability: "available",

  sizes: [
    { name: "Mini (8oz)", price: 8 },
    { name: "Selfie (16oz)", price: 15 },
    { name: "1 dozen 3oz Party cups", price: 36 },
    { name: 'Usie (8"x8" Pan)', price: 30 },
    { name: 'Family (9"x9" Pan)', price: 40 },
    { name: 'Party (9"x13" Pan)', price: 50 },
    { name: "Party Plus (Feeds 15-20)", price: 60 }
  ],
  },
  {
    id: "prod-002",
    name: "Margherita Pizza",
    description: "Traditional pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 12.5,
    imageRef: "/images/margherita-pizza.jpg",
    availability: "unavailable",
    sizes: [
  { name: 'Small', price: 12.50 },
  { name: 'Large', price: 18.50 }
],
  },
  {
    id: "prod-003",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing.",
    price: 7.5,
    imageRef: "/images/caesar-salad.jpg",
    availability: "available",
    sizes: [
  { name: 'Small', price: 12.50 },
  { name: 'Large', price: 18.50 }
],
  },
  {
    id: "prod-004",
    name: "French Fries",
    description: "Golden, crispy fries seasoned with a touch of sea salt.",
    price: 3.99,
    imageRef: "/images/french-fries.jpg",
    availability: "unavailable",
    sizes: [
  { name: 'Small', price: 12.50 },
  { name: 'Large', price: 18.50 }
],
  },
  {
    id: "prod-005",
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream.",
    price: 5.25,
    imageRef: "/images/chocolate-milkshake.jpg",
    availability: "available",
    sizes: [
  { name: 'Small', price: 12.50 },
  { name: 'Large', price: 18.50 }
],
  },
  {
    id: "prod-006",
    name: "Grilled Chicken Sandwich",
    description: "Grilled chicken breast with fresh greens and garlic aioli.",
    price: 8.75,
    imageRef: "/images/chicken-sandwich.jpg",
    availability: "available",
    
  },
];