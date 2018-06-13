import { combineSources, scanPlans, stream } from "react-streams"
import { concat, from, merge, of } from "rxjs"
import {
  delay,
  map,
  mapTo,
  partition,
  scan,
  shareReplay,
  switchMap
} from "rxjs/operators"
import { calcTotal } from "./pipes"
import { addToCart, checkout, removeFromCart } from "./plans"

const products = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
]

const checkout$ = from(checkout)

const [checkoutValid$, checkoutInvalid$] = checkout$.pipe(
  partition(items => items.filter(item => item.quantity).length < 3)
)

const checkoutRequest$ = checkoutValid$.pipe(
  switchMap(items => {
    //fake an ajax request delay
    return of(items).pipe(delay(1000))
  })
)

const status$ = merge(
  checkout$.pipe(mapTo({ error: "Checkout pending..." })),
  checkoutInvalid$.pipe(
    mapTo({ error: "Can only checkout 2 unique items 🤷‍♀️" })
  ),
  checkoutRequest$.pipe(
    switchMap(() =>
      concat(of({ error: "Success" }), of({ error: "" }).pipe(delay(1000)))
    )
  )
).pipe(shareReplay(1))

const products$ = concat(of({ products }), checkoutRequest$).pipe(
  scan(({ products }, items) => {
    return {
      products: products.map(item => {
        const { quantity } = items.find(({ id }) => id === item.id)
        return {
          ...item,
          inventory: item.inventory - quantity
        }
      })
    }
  }),
  shareReplay(1)
)

// products$.subscribe(products => console.log({ products }))

const cart$ = products$
  .pipe(
    map(({ products }) => ({
      cart: products.map(product => ({ id: product.id, quantity: 0 }))
    })),
    scanPlans({ addToCart, removeFromCart })
  )
  .pipe(shareReplay(1))

// cart$.subscribe(cart => console.log({ cart }))

const store$ = combineSources(products$, cart$).pipe(
  map(({ products, cart, ...rest }) => ({
    items: products.map(product => {
      const cartItem = cart.find(({ id }) => id === product.id)
      return {
        ...product,
        quantity: cartItem.quantity,
        remaining: product.inventory - cartItem.quantity
      }
    }),
    ...rest,
    checkout
  })),
  shareReplay(1)
)

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
