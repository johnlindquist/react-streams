import React, { createContext } from "react"
import ProductList from "./components/ProductList"
import Cart from "./components/Cart"
import {
  StatusStream,
  ProductsStream,
  CartStream,
  StoreStream,
  Debug
} from "./streams"

export default () => (
  <div>
    <h2>Shopping Cart Example</h2>
    <hr />
    <StoreStream render={ProductList} />
    <hr />
    <StoreStream render={Cart} />
    <hr />

    <StatusStream render={Debug("Status")} />
    <CartStream render={Debug("Cart")} />
    <ProductsStream render={Debug("Products")} />
    <StoreStream render={Debug("Store")} />
  </div>
)
