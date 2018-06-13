import React from "react"
import { plan, scanPlans, stream, scanSequence } from "react-streams"
import { from, of } from "rxjs"
import {
  concatAll,
  delay,
  map,
  scan,
  share,
  switchMap,
  concatMap
} from "rxjs/operators"

const three = plan(
  delay(300),
  map(({ things }) => ({ things: [...things, "three"] }))
)

const two = plan(
  delay(200),
  map(({ things }) => ({ things: [...things, "two"] }))
)

const one = plan(
  delay(100),
  map(({ things }) => ({ things: [...things, "one"] }))
)

const start = plan(scanSequence(one, two, three))

const Sequence = stream(of({ things: ["zero"] }).pipe(scanPlans({ start })))

export default () => (
  <div>
    <Sequence>
      {({ start, things }) => (
        <div>
          <button onClick={() => start({ things })}>Start</button>
          {things.map((thing, index) => (
            <div key={index}>
              {index}. {thing}
            </div>
          ))}
        </div>
      )}
    </Sequence>
  </div>
)
