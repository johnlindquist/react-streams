import React from "react"
import { plan, stream } from "react-streams"
import {
  delay,
  scan,
  startWith,
  first,
  withLatestFrom,
  skipUntil,
  tap
} from "rxjs/operators"
import { from } from "rxjs"

const planState = plan(
  startWith({ count: 0 }),
  delay(4000),
  tap(() => console.log(`--after delay--`)),
  scan((state, fn) => (fn instanceof Function ? fn(state) : fn))
)
const Counter = stream(planState)

const inc = () => planState(({ count }) => ({ count: count + 1 }))
const dec = () => planState(({ count }) => ({ count: count - 1 }))
setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`1st`, value)
  })
}, 1000)
setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`2nd`, value)
  })
}, 2000)
setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`3nd`, value)
  })
}, 3000)
setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`4th`, value)
  })
}, 4000)
setTimeout(() => {
  inc().subscribe({
    next: value => console.log(`5th`, value)
  })
}, 5000)
// inc()
//   .pipe(first())
//   .subscribe({
//     next: value => console.log(`next`, value),
//     complete: value => console.log(`complete`, value)
//   })

// inc()
//   .pipe(first())
//   .subscribe({
//     next: value => console.log(`next`, value),
//     complete: value => console.log(`complete`, value)
//   })

// inc()
//   .pipe(first())
//   .subscribe({
//     next: value => console.log(`next`, value),
//     complete: value => console.log(`complete`, value)
//   })

export default () => (
  <Counter>
    {({ count }) => (
      <div>
        <button onClick={inc}>+</button>
        <h2>{count}</h2>
        <button onClick={dec}>-</button>
      </div>
    )}
  </Counter>
)
