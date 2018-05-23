import React, { createContext } from "react"
import ProductList from "./components/ProductList"
import Cart from "./components/Cart"
import { ProductsStream, CartStream } from "./streams"

export default () => (
  <div>
    <h2>Shopping Cart Example</h2>
    <hr />
    <ProductsStream render={ProductList} />
    <hr />
    <CartStream render={Cart} />
    <CartStream>{stuff => <div>{JSON.stringify(stuff)}</div>}</CartStream>
  </div>
)
