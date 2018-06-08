import { pipe, UnaryFunction } from "rxjs"
import { map, withLatestFrom } from "rxjs/operators"

export const fromPlan = (otherPlan, selector): UnaryFunction<any, any> =>
  pipe(
    withLatestFrom(otherPlan, (_, value) => value),
    map(selector)
  )
