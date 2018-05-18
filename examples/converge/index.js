import React from "react"
import { stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { map, mapTo } from "rxjs/operators"

const date = plan(
  map(() => ({
    message: new Date().toLocaleDateString()
  }))
)
const bye = plan(mapTo({ message: "Bye" }))
const exclaim = plan(
  mapTo(({ message }) => ({
    message: message + "!"
  }))
)

const ConvergeDemo = stream(converge({ date, bye, exclaim }))

export default () => (
  <div>
    <ConvergeDemo message="Hello" title="Converge Demo">
      {({ message, title, date, by, exclaim }) => (
        <div>
          <h2>{title}</h2>
          <div id="message">{message}</div>
          <button onClick={date} aria-label="show date message">
            Date
          </button>
          <button onClick={bye} aria-label="show bye message">
            Bye
          </button>
          <button onClick={exclaim} aria-label="add exclamation point">
            !!!
          </button>
        </div>
      )}
    </ConvergeDemo>
  </div>
)
