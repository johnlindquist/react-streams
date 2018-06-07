import React from "react"
import Product from "./Product"

export default ({
  title,
  inventory,
  price,
  quantity,
  remaining,
  onAddToCartClicked
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <div>
        {title} - &#36;{price}
        {remaining ? ` - ${remaining} remaining` : ``}
        <button
          onClick={onAddToCartClicked}
          disabled={remaining > 0 ? "" : "disabled"}
        >
          {remaining > 0 ? "Add to cart" : "Sold Out"}
        </button>
      </div>
    </div>
  )
}
