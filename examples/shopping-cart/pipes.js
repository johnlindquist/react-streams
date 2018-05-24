import { concat, of, pipe } from "rxjs"
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  tap,
  share
} from "rxjs/operators"

export const addToProductsPipe = pipe(
  distinctUntilChanged(),
  map(item => ({ products }) => {
    const itemIndex = products.findIndex(({ id: _id }) => _id === item.id)

    const productItem = products[itemIndex]
    const updateProductItem = {
      ...productItem,
      inventory: productItem.inventory + 1
    }

    return {
      products: [
        ...products.slice(0, itemIndex),
        updateProductItem,
        ...products.slice(itemIndex + 1)
      ]
    }
  })
)

export const removeFromCartPipe = plan =>
  map(id => ({ products }) => {
    const cartItemIndex = products.findIndex(({ id: _id }) => _id === id)

    const cartItem = products[cartItemIndex]
    const updateCartItem = { ...cartItem, quantity: cartItem.quantity - 1 }

    return of({
      products: updateCartItem.quantity
        ? [
            ...products.slice(0, cartItemIndex),
            updateCartItem,
            ...products.slice(cartItemIndex + 1)
          ]
        : [
            ...products.slice(0, cartItemIndex),
            ...products.slice(cartItemIndex + 1)
          ]
    }).pipe(tap(() => plan(updateCartItem)))
  })

export const removeFromProductsPipe = plan =>
  map(id => ({ products }) => {
    const itemIndex = products.findIndex(({ id: _id }) => _id === id)

    const item = products[itemIndex]
    const updateProductItem = { ...item, inventory: item.inventory - 1 }

    return of({
      products: [
        ...products.slice(0, itemIndex),
        updateProductItem,
        ...products.slice(itemIndex + 1)
      ]
    }).pipe(tap(() => plan(updateProductItem)))
  })

export const addToCartPipe = pipe(
  distinctUntilChanged(),
  map(item => ({ products, ...rest }) => {
    console.log(`add to cart`, { item, products, rest })
    const cartItemIndex = products.findIndex(({ id: _id }) => _id === item.id)
    const cartItem = cartItemIndex > -1 ? products[cartItemIndex] : null

    return {
      products: cartItem
        ? [
            ...products.slice(0, cartItemIndex),
            {
              ...cartItem,
              quantity: cartItem.quantity + 1
            },
            ...products.slice(cartItemIndex + 1)
          ]
        : [...products, { ...item, quantity: 1 }]
    }
  })
)

export const checkoutPipe = map(event => ({ products }) => {
  if (products.length > 2) {
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
      products: [],
      error: ""
    }).pipe(delay(2000))
  )
})

export const calcTotal = map(({ total, products, ...rest }) => ({
  total: products
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2),
  products,
  ...rest
}))
