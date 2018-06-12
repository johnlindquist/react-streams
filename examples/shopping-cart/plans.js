import { plan } from "react-streams"
import { addToCartPipe, checkoutPipe, removeFromCartPipe } from "./pipes"

export const addToCart = plan(addToCartPipe)

export const removeFromCart = plan(removeFromCartPipe)

export const checkout = plan(checkoutPipe)
