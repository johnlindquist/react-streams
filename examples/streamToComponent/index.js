import React from "react"
import { streamToComponent } from "react-streams"
import { ajax } from "rxjs/ajax"
import { map, pluck } from "rxjs/operators"

const stream$ = ajax("api/todos").pipe(
  pluck("response"),
  map(todos => ({ todos }))
)

const StateContainer = streamToComponent(stream$)

export default () => (
  <StateContainer>
    {({ todos }) => (
      <div>
        <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
      </div>
    )}
  </StateContainer>
)
