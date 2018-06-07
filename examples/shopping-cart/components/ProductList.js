import React from "react"
import ProductItem from "./ProductItem"

export default ({ items, addToCart }) => (
  <div>
    <h3>Products</h3>
    {items.map(item => (
      <ProductItem
        {...item}
        key={item.id}
        onAddToCartClicked={() => addToCart(item.id)}
      />
    ))}
  </div>
)
