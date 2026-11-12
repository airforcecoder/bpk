/* BPK-140: Product data moved to shared/product.ts so the frontend and backend use one source.
   This re-export keeps existing imports working. New code can import from shared/ directly. */
export { mockProducts, type Product, type ProductAvailability } from '../../../shared/product'
