import { Observable, observable, queueScheduler } from "rxjs"
import { share, observeOn, subscribeOn } from "rxjs/operators"

export function plan(...operators) {
  let next

  const o$ = new Observable(observer => {
    next = (...arg) => {
      observer.next(...arg)
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
