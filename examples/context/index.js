import React, { createContext } from "react"
import { Stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const bye = plan(mapTo({ message: "Bye" }))
const yo = plan(mapTo({ message: "Yo" }))
const source = converge(message$, bye, yo)

const { Consumer } = createContext({ source, bye, yo })

export default () => (
  <div>
    <Consumer>
      {({ source }) => (
        <Stream source={source}>
          {({ message }) => <h2 id="message">{message}</h2>}
        </Stream>
      )}
    </Consumer>

    <div>
      <div>
        <div>
          <Consumer>
            {({ bye, yo }) => (
              <div>
                <button onClick={bye} aria-label="show bye message">
                  Bye
                </button>
                <button onClick={yo} aria-label="show yo message">
                  Yo
                </button>
              </div>
            )}
          </Consumer>
        </div>
      </div>
    </div>
  </div>
)
