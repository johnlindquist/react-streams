import { combineLatest } from "rxjs"
import { map } from "rxjs/operators"

export const combineSources = (...sources) =>
  combineLatest(...sources).pipe(
    map(values => values.reduce((a, c) => ({ ...a, ...c }), {}))
  )
