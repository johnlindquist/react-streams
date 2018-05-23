import { mergeSources, mergePlans, stream, plan } from "react-streams"
import { of, pipe } from "rxjs"
import { shareReplay, map, tap } from "rxjs/operators"

const products = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
]

const products$ = of({ products }).pipe(shareReplay(1))
const cart$ = of({ cart: [] }).pipe(shareReplay(1))

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

const addToCart = plan(addToCartPipe)

const checkout = plan()
const removeFromCart = plan(removeFromCartPipe)

const store$ = mergePlans(
  { addToCart, checkout, removeFromCart },
  mergeSources(products$, cart$)
)

export const ProductsStream = stream(store$, map(({ cart, ...rest }) => rest))

export const CartStream = stream(
  store$,
  map(({ products: nope, cart: products, ...rest }) => {
    const total = products
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2)

    const error = "no error"
    const checkoutPending = false
    return { products, total, error, ...rest }
  })
)
