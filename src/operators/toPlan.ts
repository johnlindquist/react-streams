import { pipe, UnaryFunction } from "rxjs"
import { ignoreElements, map, tap } from "rxjs/operators"

export const toPlan = (otherPlan, selector = x => x): UnaryFunction<any, any> =>
  pipe(
    map(selector),
    tap(otherPlan),
    ignoreElements()
  )
