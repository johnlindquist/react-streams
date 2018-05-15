import React from "react"
import { Stream } from "react-streams"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"
import { of } from "rxjs"

const url = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

const Todo = ({ url, id, ...props }) => {
  const todo$ = of({ url, id }).pipe(
    switchMap(({ url, id }) => ajax(`${url}/${id}`)),
    pluck("response")
  )
  return <Stream source={todo$} {...props} />
}

export default () => (
  <Todo url={url} id={3}>
    {({ text, id }) => (
      <div>
        {id}. {text}
      </div>
    )}
  </Todo>
)
