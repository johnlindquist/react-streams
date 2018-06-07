import { plan } from "react-streams"
import {
  addToCartPipe,
  checkoutPipe,
  clearCartPipe,
  removeFromCartPipe,
  updateStatusPipe,
  updateInventoryPipe
} from "./pipes"
import { pipe, from, concat } from "rxjs"
import { delay, tap, first } from "rxjs/operators"

export const addToCart = plan(addToCartPipe)

export const removeFromCart = plan(removeFromCartPipe)

export const updateStatus = plan(updateStatusPipe)

export const updateInventory = plan(updateInventoryPipe)
export const clearCart = plan(clearCartPipe)

export const checkout = store$ => plan(checkoutPipe(store$))
