import {
  mockProducts,
  type Product,
} from "../data/mockProducts";

export async function getProducts(): Promise<Product[]> {
  return mockProducts;
}