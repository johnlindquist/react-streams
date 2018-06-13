import { merge } from "rxjs"
import { patchScan } from "../operators/patchScan"

export const scanStreams = source => (...streams) =>
  merge(source, ...streams).pipe(patchScan)
