import React from "react"
import { from } from "rxjs"
import { plan, stream } from "react-streams"
import {
  map,
  scan,
  startWith,
  shareReplay,
  delay,
  tap,
  throttleTime
} from "rxjs/operators"

const planState = plan(
  startWith({ count: 0 }),
  tap(() => console.log(`after delay...`)),
  scan((state, fn) => (fn instanceof Function ? fn(state) : fn))
)

const inc = () => planState(({ count }) => ({ count: count + 1 }))
const dec = () => planState(({ count }) => ({ count: count - 1 }))

from(planState).subscribe({
  next: value => console.log(`main next`, value),
  complete: value => console.log(`main complete`, value)
})

setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`1st next`, value),
    complete: value => console.log(`1st complete`, value)
  })
}, 1000)

setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`2nd next`, value),
    complete: value => console.log(`2nd complete`, value)
  })
}, 2000)

setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`3rd next`, value),
    complete: value => console.log(`3rd complete`, value)
  })
}, 3000)

setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`4th next`, value),
    complete: value => console.log(`4th complete`, value)
  })
}, 4000)

// inc().subscribe({
//   next: value => console.log(`second next`, value),
//   complete: value => console.log(`complete`, value)
// })

// inc().subscribe({
//   next: value => console.log(`third next`, value),
//   complete: value => console.log(`complete`, value)
// })

const Counter = stream(planState)

export default () => <div />
