import React from "react"
import Product from "./Product"

export default ({ product, onAddToCartClicked }) => (
  <div style={{ marginBottom: 20 }}>
    <Product {...product}>
      <button
        onClick={onAddToCartClicked}
        disabled={product.inventory > 0 ? "" : "disabled"}
      >
        {product.inventory > 0 ? "Add to cart" : "Sold Out"}
      </button>
    </Product>
  </div>
)
