import './ProductSearchBar.css'

type ProductSearchBarProps = {
  value: string
  onChange: (value: string) => void
}

function ProductSearchBar({ value, onChange }: ProductSearchBarProps) {
  return (
    <div className="product-search">
      <label className="product-search__label" htmlFor="product-search-input">
        Search flavors
      </label>
      <div className="product-search__field">
        <input
          id="product-search-input"
          className="product-search__input"
          type="text"
          value={value}
          placeholder="Search by name or description"
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            type="button"
            className="product-search__clear"
            onClick={() => onChange('')}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductSearchBar