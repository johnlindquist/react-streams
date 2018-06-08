import { isObservable } from "rxjs"

export const isNotPlan = x => isObservable(x) && !(x instanceof Function)
