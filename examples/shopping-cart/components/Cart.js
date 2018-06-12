import React, { Component } from "react"
import CartItem from "./CartItem"
import { StatusStream } from "../streams"

export default class Cart extends Component {
  render() {
    const {
      items,
      total,
      error,
      checkoutPending,
      checkout,
      removeFromCart
    } = this.props

    const hasProducts = items.length > 0
    const checkoutAllowed = hasProducts && !checkoutPending

    const nodes = !hasProducts ? (
      <em>Please add some products to cart.</em>
    ) : (
      items
        .filter(({ quantity, inventory }) => quantity)
        .map(product => (
          <CartItem
            {...product}
            key={product.id}
            onRemove={() => removeFromCart(product.id)}
          />
        ))
    )

    return (
      <div>
        <h3>Your Cart</h3>
        <div>{nodes}</div>
        <p>Total: &#36;{total}</p>
        <button
          onClick={e => checkout(items)}
          disabled={checkoutAllowed ? "" : "disabled"}
        >
          Checkout
        </button>
        <StatusStream>
          {({ error }) => <div style={{ color: "red" }}>{error}</div>}
        </StatusStream>
      </div>
    )
  }
}
