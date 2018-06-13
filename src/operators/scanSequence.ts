import { from } from "rxjs"
import { concatMap, mergeScan } from "rxjs/operators"

export const scanSequence = (...plans) =>
  concatMap(value =>
    from([...plans]).pipe(
      mergeScan(
        (prev, next: any) => {
          console.log({ prev, next })
          return next(prev)
        },
        value,
        1
      )
    )
  )
