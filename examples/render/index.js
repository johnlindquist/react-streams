import React from "react"
import { StreamProps } from "react-streams"
import { of, pipe } from "rxjs"
import { catchError, map } from "rxjs/operators"

const catchMissingMessage = pipe(
  map(({ getMessage }) => ({ message: getMessage() + "!" })),
  catchError(error =>
    of({
      render: () => (
        <div
          style={{
            color: "red",
            fontWeight: "bold",
            border: "3px solid black",
            width: "max-content"
          }}
        >
          ⚠️{error.message}⚠️
        </div>
      )
    })
  )
)

export default () => (
  <div>
    <h2>Catch and Render</h2>
    <StreamProps getMessage={() => "Hello"} pipe={catchMissingMessage}>
      {({ message }) => <div>{message}</div>}
    </StreamProps>
    <StreamProps pipe={catchMissingMessage}>
      {({ message }) => <div>{message}</div>}
    </StreamProps>
  </div>
)
