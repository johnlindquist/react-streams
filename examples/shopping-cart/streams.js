import { mergeSources, mergePlans, stream, plan } from "react-streams"
import { of, pipe } from "rxjs"
import { shareReplay, map, tap } from "rxjs/operators"
import { addToCart, removeFromCart, checkout } from "./plans"

const products = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
]

const products$ = of({ products }).pipe(shareReplay(1))
const cart$ = of({ cart: [] }).pipe(shareReplay(1))

const store$ = mergePlans(
  { addToCart, removeFromCart, checkout },
  mergeSources(products$, cart$)
)

export const DebugStream = stream(store$)

export const ProductsStream = stream(store$, map(({ cart, ...rest }) => rest))

export const CartStream = stream(
  store$,
  map(({ products: nope, cart: products, ...rest }) => {
    const total = products
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2)

    const error = ""
    const checkoutPending = false
    return { products, total, error, ...rest }
  })
)
