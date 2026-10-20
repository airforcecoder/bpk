export type ProductAvailability = "available" | "unavailable";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageRef: string;
  availability: ProductAvailability;
}

export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, cheese, and house sauce.",
    price: 9.99,
    imageRef: "/images/classic-burger.jpg",
    availability: "available",
  },
  {
    id: "prod-002",
    name: "Margherita Pizza",
    description: "Traditional pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 12.5,
    imageRef: "/images/margherita-pizza.jpg",
    availability: "available",
  },
  {
    id: "prod-003",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing.",
    price: 7.5,
    imageRef: "/images/caesar-salad.jpg",
    availability: "available",
  },
  {
    id: "prod-004",
    name: "French Fries",
    description: "Golden, crispy fries seasoned with a touch of sea salt.",
    price: 3.99,
    imageRef: "/images/french-fries.jpg",
    availability: "unavailable",
  },
  {
    id: "prod-005",
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream.",
    price: 5.25,
    imageRef: "/images/chocolate-milkshake.jpg",
    availability: "available",
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