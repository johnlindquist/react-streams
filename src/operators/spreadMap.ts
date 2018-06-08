import { map } from "rxjs/operators"

export const spreadMap = (overrides = {}) =>
  map(value => ({ ...value, ...overrides }))
