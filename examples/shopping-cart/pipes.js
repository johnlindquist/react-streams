import { concat, of, pipe, merge, race } from "rxjs"
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  tap,
  share,
  switchMap,
  first,
  withLatestFrom,
  ignoreElements
} from "rxjs/operators"

export const removeFromCartPipe = map(id => ({ cart }) => {
  const cartItemIndex = cart.findIndex(({ id: _id }) => _id === id)

  const cartItem = cart[cartItemIndex]
  const updateCartItem = { ...cartItem, quantity: cartItem.quantity - 1 }

  return of({
    cart: [
      ...cart.slice(0, cartItemIndex),
      updateCartItem,
      ...cart.slice(cartItemIndex + 1)
    ]
  })
})

export const addToCartPipe = pipe(
  map(id => ({ cart, ...rest }) => {
    const cartItemIndex = cart.findIndex(({ id: _id }) => _id === id)
    const cartItem = cart[cartItemIndex]

    return {
      cart: [
        ...cart.slice(0, cartItemIndex),
        {
          ...cartItem,
          quantity: cartItem.quantity + 1
        },
        ...cart.slice(cartItemIndex + 1)
      ]
    }
  })
)

export const updateStatusPipe = map(newStatus => oldStatus => ({
  ...oldStatus,
  ...newStatus
}))

export const calcTotal = map(({ total, items, ...rest }) => ({
  total: items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2),
  items,
  ...rest
}))

export const clearCartPipe = map(() => ({ cart }) => ({
  cart: cart.map(item => ({ ...item, quantity: 0 }))
}))

export const updateInventoryPipe = map(cart => ({ products }) => ({
  products: products.map(item => {
    const { quantity } = cart.find(({ id }) => id === item.id)
    return {
      ...item,
      inventory: item.inventory - quantity
    }
  })
}))

export const checkoutPipe = store$ => {
  return pipe(
    withLatestFrom(store$, (_, store) => store),
    switchMap(store => {
      const { items, updateStatus } = store

      if (items.filter(item => item.quantity > 0).length > 2) {
        updateStatus({ error: "nope..." })
        return of({})
      }

      updateStatus({ error: "ok..." })
      return of(store)
    }),
    // switchMap$ => [
    //   store$.pipe(
    //     tap(store => console.log(store)),
    //     filter(
    //       store => store.items.filter(item => item.quantity > 0).length > 2
    //     ),
    //     setStatus("nope...")
    //   ),
    //   store$.pipe(setStatus("ok..."))
    // ],

    // partition(store => {
    //   console.log(store)
    //   return true
    // }),
    // switchMap(([valid$, invalid$]) => {
    //   return merge(
    //     valid$.pipe(
    //       tap(({ updateInventory, items }) => {
    //         updateInventory(items)
    //       }),
    //       tap(({ clearCart }) => clearCart()),
    //       delay(2000),

    //       setStatus("Done..."),
    //       delay(2000),

    //       setStatus("")
    //     ),
    //     invalid$.pipe(setStatus("Nope..."))
    //   )
    // }),
    ignoreElements() //we don't want to update the store
  )
}
