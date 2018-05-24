import React, { createContext } from "react"
import ProductList from "./components/ProductList"
import Cart from "./components/Cart"
import { ProductsStream, CartStream, DebugStream } from "./streams"

export default () => (
  <div>
    <h2>Shopping Cart Example</h2>
    <hr />
    <ProductsStream render={ProductList} />
    <hr />
    <CartStream render={Cart} />
    <hr />

    <ProductsStream>
      {data => (
        <div
          style={{
            fontFamily: "Menlo",
            backgroundColor: "whitesmoke",
            padding: "1rem"
          }}
        >
          <h4>Debug Products</h4>
          {JSON.stringify(data)}
        </div>
      )}
    </ProductsStream>
    <CartStream>
      {data => (
        <div
          style={{
            fontFamily: "Menlo",
            backgroundColor: "whitesmoke",
            padding: "1rem"
          }}
        >
          <h4>Debug Cart</h4>
          {JSON.stringify(data)}
        </div>
      )}
    </CartStream>
  </div>
)
