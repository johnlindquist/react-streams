import React, { Component } from "react"
import Product from "./Product"

export default class CartItem extends Component {
  render() {
    const { price, quantity, title, onRemove } = this.props

    return (
      <Product price={price} quantity={quantity} title={title}>
        <button onClick={onRemove}>{" X "}</button>
      </Product>
    )
  }
}
