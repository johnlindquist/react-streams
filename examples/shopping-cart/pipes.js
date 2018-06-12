import { of, pipe } from "rxjs"
import { map } from "rxjs/operators"

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

export const calcTotal = map(({ total, items, ...rest }) => ({
  total: items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2),
  items,
  ...rest
}))

export const checkoutPipe = pipe()
