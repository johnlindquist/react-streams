import React from "react"

export default ({ price, quantity, title, children, inventory }) => (
  <div>
    {title} - &#36;{price} {quantity ? `x ${quantity}` : null} {children}
    {inventory ? ` - ${inventory} remaining` : ``}
  </div>
)
