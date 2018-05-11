import React from "react"
import { delay, startWith } from "rxjs/operators"
import { componentFromOps } from "react-streams"

const Message = componentFromOps(delay(2000), startWith({ message: "Wait..." }))

export default () => (
  <Message message="Hello">{({ message }) => <div>{message}</div>}</Message>
)
