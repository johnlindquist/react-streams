import { Observable, observable } from "rxjs"
import { shareReplay } from "rxjs/operators"

export function plan(...operators) {
  let next

  const o$ = new Observable(observer => {
    next = (...arg) => {
      observer.next(...arg)
    }
  }).pipe(
    ...operators,
    shareReplay(1)
  )

  const unsubscribe = o$.subscribe()
  next["unsubscribe"] = unsubscribe
  next[observable] = () => o$
  return next
}
