import { Observable, observable } from "rxjs"
import { mapTo, share } from "rxjs/operators"

export function plan(...operators) {
  let next

  const [first, ...rest] = operators
  const ops = first
    ? first instanceof Function
      ? operators
      : [mapTo(first), ...rest]
    : operators

  const o$ = new Observable(observer => {
    next = (...arg) => {
      observer.next(...arg)
    }
  }).pipe(
    ...ops,
    share()
  )

  const unsubscribe = o$.subscribe()
  next["unsubscribe"] = unsubscribe
  next[observable] = () => o$
  return next
}
