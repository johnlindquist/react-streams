import React from "react"
import { componentFromStream } from "react-streams"
import { ajax } from "rxjs/ajax"
import { map, pluck } from "rxjs/operators"

const endpoint = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

console.log(endpoint)

const stream$ = ajax(endpoint).pipe(
  pluck("response"),
  map(todos => ({ todos }))
)

const StateContainer = componentFromStream(stream$)

export default () => (
  <StateContainer>
    {({ todos }) => (
      <div>
        <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
      </div>
    )}
  </StateContainer>
)
