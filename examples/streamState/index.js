import React from "react"
import { streamState } from "react-streams"
import { ajax } from "rxjs/ajax"
import { pluck, share } from "rxjs/operators"

const endpoint = process.env.DEV
  ? "api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"
const state = { endpoint }

const toStream = ({ endpoint }) => ({
  todos: ajax(endpoint).pipe(pluck("response"))
})
const stream$ = toStream(state)

const StateContainer = streamState(toStream)(state)
export default () => (
  <div>
    <StateContainer>
      {({ todos }) => (
        <div>
          <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
        </div>
      )}
    </StateContainer>
    <div>
      <div>
        <div>
          <StateContainer>
            {({ todos }) => (
              <div>
                <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
              </div>
            )}
          </StateContainer>
        </div>
      </div>
    </div>
  </div>
)
