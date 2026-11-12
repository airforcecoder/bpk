import type { AvailabilityFilter, SortOrder } from '../utils/filterProducts'
import './ProductFilterControls.css'

type ProductFilterControlsProps = {
  availability: AvailabilityFilter
  sort: SortOrder
  onAvailabilityChange: (value: AvailabilityFilter) => void
  onSortChange: (value: SortOrder) => void
}

function ProductFilterControls({
  availability,
  sort,
  onAvailabilityChange,
  onSortChange,
}: ProductFilterControlsProps) {
  return (
    <div className="product-filters">
      <div className="product-filters__group">
        <label className="product-filters__label" htmlFor="availability-filter">
          Availability
        </label>
        <select
          id="availability-filter"
          className="product-filters__select"
          value={availability}
          onChange={(event) =>
            onAvailabilityChange(event.target.value as AvailabilityFilter)
          }
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Sold out</option>
        </select>
      </div>

      <div className="product-filters__group">
        <label className="product-filters__label" htmlFor="sort-order">
          Sort by
        </label>
        <select
          id="sort-order"
          className="product-filters__select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOrder)}
        >
          <option value="default">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
    </div>
  )
}

export default ProductFilterControls