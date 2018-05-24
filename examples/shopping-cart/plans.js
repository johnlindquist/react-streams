import { plan } from "react-streams"
import { map, delay, switchMapTo, switchMap } from "rxjs/operators"
import { concat, of } from "rxjs"

const checkoutPipe = map(event => ({ cart }) => {
  if (cart.length > 2) {
    return {
      error: "2 item max, remove items from cart"
    }
  }
  return concat(
    of({
      checkoutPending: true,
      error: "Processing..."
    }),
    of({
      checkoutPending: false,
      cart: [],
      error: ""
    }).pipe(delay(2000))
  )
})

const addToCartPipe = map(id => ({ products, cart }) => {
  const itemIndex = products.findIndex(({ id: _id }) => _id === id)
  const cartItemIndex = cart.findIndex(({ id: _id }) => _id === id)

  const item = products[itemIndex]
  const updateProductItem = { ...item, inventory: item.inventory - 1 }

  const cartItem = cartItemIndex > -1 ? cart[cartItemIndex] : null

  return {
    products: [
      ...products.slice(0, itemIndex),
      updateProductItem,
      ...products.slice(itemIndex + 1)
    ],
    cart: cartItem
      ? [
          ...cart.slice(0, cartItemIndex),
          {
            ...cartItem,
            quantity: cartItem.quantity + 1
          },
          ...cart.slice(cartItemIndex + 1)
        ]
      : [...cart, { ...item, quantity: 1 }]
  }
})

const removeFromCartPipe = map(id => ({ products, cart }) => {
  const itemIndex = products.findIndex(({ id: _id }) => _id === id)
  const cartItemIndex = cart.findIndex(({ id: _id }) => _id === id)

  const item = products[itemIndex]
  const updateProductItem = { ...item, inventory: item.inventory + 1 }

  const cartItem = cart[cartItemIndex]
  const updateCartItem = { ...cartItem, quantity: cartItem.quantity - 1 }

  return {
    products: [
      ...products.slice(0, itemIndex),
      updateProductItem,
      ...products.slice(itemIndex + 1)
    ],
    cart: updateCartItem.quantity
      ? [
          ...cart.slice(0, cartItemIndex),
          updateCartItem,
          ...cart.slice(cartItemIndex + 1)
        ]
      : [...cart.slice(0, cartItemIndex), ...cart.slice(cartItemIndex + 1)]
  }
})

export const addToCart = plan(addToCartPipe)
export const removeFromCart = plan(removeFromCartPipe)
export const checkout = plan(checkoutPipe)
