import { mergePlans, stream } from "react-streams"
import { from, of } from "rxjs"
import { shareReplay } from "rxjs/operators"
import { calcTotal, planOnLastItem } from "./pipes"
import {
  addToCart,
  removeFromCart,
  addToProducts,
  removeFromProducts,
  checkout
} from "./plans"

const products = {
  products: [
    { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
    { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
    { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
  ]
}

const products$ = mergePlans(
  { addToProducts, removeFromProducts },
  of(products).pipe(shareReplay(1))
)

const cart = { products: [], error: "", checkoutPending: false }

const cart$ = mergePlans(
  { addToCart, removeFromCart, checkout },
  of(cart).pipe(shareReplay(1))
)

from(products$)
  .pipe(planOnLastItem(addToCart))
  .subscribe()

from(cart$)
  .pipe(planOnLastItem(addToProducts))
  .subscribe()
export const ProductsStream = stream(products$)

export const CartStream = stream(cart$, calcTotal)
