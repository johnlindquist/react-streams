import { merge, of, pipe, UnaryFunction } from "rxjs"
import { first, map, switchMap, tap } from "rxjs/operators"

export const toPlan = (otherPlan, selector = x => x): UnaryFunction<any, any> =>
  pipe(
    tap(value => console.log(`toPlan`, value)),
    map(selector),
    switchMap(value => merge(of(value), otherPlan(value).pipe(first())))
  )
