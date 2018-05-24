import { plan } from "react-streams"
import {
  addToCartPipe,
  addToProductsPipe,
  checkoutPipe,
  removeFromCartPipe,
  removeFromProductsPipe
} from "./pipes"

export const addToProducts = plan(addToProductsPipe)
export const removeFromProducts = plan(removeFromProductsPipe)

export const addToCart = plan(addToCartPipe)
export const removeFromCart = plan(removeFromCartPipe)
export const checkout = plan(checkoutPipe)
