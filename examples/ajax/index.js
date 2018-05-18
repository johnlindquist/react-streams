import React from "react"
import { stream } from "react-streams"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"
import { of, pipe } from "rxjs"

const getTodo = pipe(
  switchMap(({ url, id }) => ajax(`${url}/${id}`)),
  pluck("response")
)

const Todo = stream(getTodo)

const url = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

export default () => (
  <Todo url={url} id={3}>
    {({ text, id }) => (
      <div>
        {id}. {text}
      </div>
    )}
  </Todo>
)
