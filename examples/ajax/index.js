import React from "react"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"
import { pipeProps } from "react-streams"

const endpoint = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

const Todo = pipeProps(
  switchMap(({ id }) => ajax(`${endpoint}/${id}`)),
  pluck("response")
)

export default () => (
  <Todo id="1">
    {({ text, id }) => (
      <div>
        {id}. {text}
      </div>
    )}
  </Todo>
)
