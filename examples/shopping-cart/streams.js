import { scanPlans, combineSources, stream } from "react-streams"
import { from, of } from "rxjs"
import { map, shareReplay, tap } from "rxjs/operators"
import { calcTotal } from "./pipes"
import {
  addToCart,
  removeFromCart,
  clearCart,
  checkout,
  updateStatus,
  updateInventory
} from "./plans"

const products = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
]

const status$ = scanPlans(
  { updateStatus },
  of({
    error: "",
    checkoutPending: false
  })
).pipe(shareReplay(1))

// status$.subscribe(status => console.log({ status }))

const products$ = scanPlans(
  { updateInventory },
  of({
    products
  })
).pipe(shareReplay(1))

// products$.subscribe(products => console.log({ products }))

const cart$ = scanPlans(
  { addToCart, removeFromCart, clearCart },
  products$.pipe(
    map(({ products }) => ({
      cart: products.map(product => ({ id: product.id, quantity: 0 }))
    }))
  )
).pipe(shareReplay(1))

// cart$.subscribe(cart => console.log({ cart }))

const combined$ = combineSources(status$, products$, cart$).pipe(
  map(({ products, cart, ...rest }) => ({
    items: products.map(product => {
      const cartItem = cart.find(({ id }) => id === product.id)
      return {
        ...product,
        quantity: cartItem.quantity,
        remaining: product.inventory - cartItem.quantity
      }
    }),
    ...rest
  }))
)

const store$ = scanPlans(
  {
    checkout: checkout(combined$)
  },
  combined$
).pipe(shareReplay(1))

// store$.subscribe(store => console.log({ store }))

export const StatusStream = stream(status$)
export const ProductsStream = stream(products$)
export const CartStream = stream(cart$)

export const StoreStream = stream(store$, calcTotal)

export const Debug = title => data => (
  <div
    style={{
      fontFamily: "Menlo",
      backgroundColor: "whitesmoke",
      padding: ".5rem"
    }}
  >
    <h4>{title}</h4>
    {JSON.stringify(data)}
  </div>
)
