import { concat, of, pipe } from "rxjs"
import { delay, distinctUntilChanged, filter, map, tap } from "rxjs/operators"

export const addToProductsPipe = map(item => ({ products }) => {
  console.log(`addToProductsPipe`, { item, products })
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

export const removeFromCartPipe = map(id => ({ products }) => {
  const cartItemIndex = products.findIndex(({ id: _id }) => _id === id)

  const cartItem = products[cartItemIndex]
  const updateCartItem = { ...cartItem, quantity: cartItem.quantity - 1 }

  return {
    products: updateCartItem.quantity
      ? [
          ...products.slice(0, cartItemIndex),
          updateCartItem,
          ...products.slice(cartItemIndex + 1)
        ]
      : [
          ...products.slice(0, cartItemIndex),
          ...products.slice(cartItemIndex + 1)
        ],
    lastRemovedItem: updateCartItem
  }
})

export const removeFromProductsPipe = map(id => ({ products }) => {
  const itemIndex = products.findIndex(({ id: _id }) => _id === id)

  const item = products[itemIndex]
  const updateProductItem = { ...item, inventory: item.inventory - 1 }

  return {
    products: [
      ...products.slice(0, itemIndex),
      updateProductItem,
      ...products.slice(itemIndex + 1)
    ],
    lastRemovedItem: updateProductItem
  }
})

export const addToCartPipe = map(item => ({ products, ...rest }) => {
  console.log({ item, products, ...{ ...rest } })
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

export const planOnLastItem = p =>
  pipe(
    map(({ lastRemovedItem }) => lastRemovedItem),
    filter(t => t),
    distinctUntilChanged(),
    tap(p)
  )
