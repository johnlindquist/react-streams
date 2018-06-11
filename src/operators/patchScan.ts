import { isObservable, of, pipe } from "rxjs"
import { mergeScan, switchMap } from "rxjs/operators"

export const patchScan: any = pipe(
  (mergeScan as any)((state, update) => {
    if (update instanceof Function) {
      const result = update(state)
      if (isObservable(result)) {
        return result.pipe(
          switchMap(foo => {
            if (foo instanceof Function) return of(foo(state))
            return of(foo)
          })
        )
      }

      return of(result)
    }
    return of({ ...state, ...update })
  })
)
