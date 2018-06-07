import React, { Component } from "react"

export default ({ price, quantity, title, onRemove }) => {
  return (
    <div price={price} quantity={quantity} title={title}>
      {title} - &#36;{price} {quantity ? `x ${quantity}` : null}
      <button onClick={onRemove}>{" X "}</button>
    </div>
  )
}
