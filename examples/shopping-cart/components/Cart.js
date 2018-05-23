import React, { Component } from "react"
import CartItem from "./CartItem"

export default class Cart extends Component {
  render() {
    const {
      products,
      total,
      error,
      checkoutPending,
      checkout,
      removeFromCart
    } = this.props

    const hasProducts = products.length > 0
    const checkoutAllowed = hasProducts && !checkoutPending

    const nodes = !hasProducts ? (
      <em>Please add some products to cart.</em>
    ) : (
      products.map(product => (
        <CartItem
          title={product.title}
          price={product.price}
          quantity={product.quantity}
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
        <button onClick={checkout} disabled={checkoutAllowed ? "" : "disabled"}>
          Checkout
        </button>
        <div style={{ color: "red" }}>{error}</div>
      </div>
    )
  }
}
