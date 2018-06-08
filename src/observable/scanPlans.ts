import { merge } from "rxjs"
import { patchScan } from "../operators/patchScan"
import { spreadMap } from "../operators/spreadMap"
import { curry } from "../utils/curry"

export const scanPlans = curry((plans, source) =>
  merge(source, ...(Object.values(plans) as any[])).pipe(
    patchScan,
    spreadMap(plans)
  )
)
