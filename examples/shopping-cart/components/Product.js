import React from "react"

export default ({ price, quantity, title, children }) => (
  <div>
    {title} - &#36;{price} {quantity ? `x ${quantity}` : null}
    {children}
  </div>
)
