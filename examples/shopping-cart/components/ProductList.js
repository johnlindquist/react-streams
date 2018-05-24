import React from "react"
import ProductItem from "./ProductItem"

export default ({ products, removeFromProducts: addToCart }) => (
  <div>
    <h3>Products</h3>
    {products.map(product => (
      <ProductItem
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCart(product.id)}
      />
    ))}
  </div>
)
