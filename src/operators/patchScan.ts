import { isObservable, of, pipe } from "rxjs"
import { scan, switchMap } from "rxjs/operators"

export const patchScan: any = pipe(
  scan((state, update: any) => {
    if (update instanceof Function) return update(state)
    return { ...state, ...update }
  }),
  switchMap((result: any) => {
    if (isObservable(result)) return result

    return of(result)
  })
)
