import { Observable, of, pipe } from "rxjs"
import { map, mergeScan } from "rxjs/operators"

//mergeScan's type should allow only 1 fn arg. Seed should be optional
export const patchScan: any = pipe(
  (mergeScan as any)((state = {}, update) => {
    const result = update instanceof Function ? update(state) : of(update)

    return result instanceof Observable
      ? result.pipe(map(next => ({ ...state, ...next })))
      : of({ ...state, ...result })
  })
)
