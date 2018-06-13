import { merge } from "rxjs"
import { patchScan } from "../operators/patchScan"
import { assign } from "../operators/assign"
import { curry } from "../utils/curry"

export const scanPlans = curry((plans, source) =>
  merge(source, ...(Object.values(plans) as any[])).pipe(
    patchScan,
    assign(plans)
  )
)
