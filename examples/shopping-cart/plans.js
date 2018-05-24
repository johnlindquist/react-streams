import { plan } from "react-streams"
import {
  addToCartPipe,
  addToProductsPipe,
  checkoutPipe,
  removeFromCartPipe,
  removeFromProductsPipe
} from "./pipes"
import { pipe } from "rxjs"
import { tap } from "rxjs/operators"

export const addToProducts = plan(addToProductsPipe)
export const addToCart = plan(addToCartPipe)

export const removeFromProducts = plan(removeFromProductsPipe(addToCart))
export const removeFromCart = plan(removeFromCartPipe(addToProducts))

export const checkout = plan(checkoutPipe)
