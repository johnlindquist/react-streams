import { sample, tap } from "rxjs/operators"

export const tapWhen = (notifier, fn, ...pipe) => source => {
  source
    .pipe(
      sample(notifier),
      ...pipe,
      tap(fn)
    )
    .subscribe()
  return source
}
