import React from "react"
import { streamProps } from "react-streams"
import { pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"

const getTodo = pipe(
  switchMap(({ url, id }) => ajax(`${url}/${id}`)),
  pluck("response")
)

const Todo = streamProps(getTodo)

const url = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

export default () => (
  <div>
    <h2>Ajax Demo</h2>
    <Todo url={url} id={2}>
      {({ text, id }) => (
        <div>
          {id}. {text}
        </div>
      )}
    </Todo>
    <Todo url={url} id={3}>
      {({ text, id }) => (
        <div>
          {id}. {text}
        </div>
      )}
    </Todo>
  </div>
)
