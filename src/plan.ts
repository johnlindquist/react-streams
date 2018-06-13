import { Observable, observable, from, asyncScheduler } from "rxjs"
import { first, share } from "rxjs/operators"

export function plan(...operators) {
  let next

  const o$ = new Observable(observer => {
    next = (...arg) => {
      observer.next(...arg)
      return o$.pipe(first())
    }
  }).pipe(
    ...operators,
    share()
  )

  const unsubscribe = o$.subscribe()
  next["unsubscribe"] = unsubscribe
  next[observable] = () => o$
  return next
}
