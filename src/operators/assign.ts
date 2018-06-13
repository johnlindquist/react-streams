import { map } from "rxjs/operators"

export const assign = object => map(value => ({ ...value, ...object }))
