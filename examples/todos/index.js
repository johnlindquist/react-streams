import React from "react"
import { plan, scanPlans, stream, streamProps, tapWhen } from "react-streams"
import { of, pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { map, mapTo, switchMap, tap, withLatestFrom } from "rxjs/operators"

const url = process.env.DEV
  ? "/api/todos"
  : // Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
    "https://dandelion-bonsai.glitch.me/todos"

const HEADERS = { "Content-Type": "application/json" }

const clearForm = plan({ current: "" })

const onChange = plan(map(event => ({ current: event.target.value })))

const addTodo = plan(
  tap(event => event.preventDefault()),
  withLatestFrom(onChange, (_, { current }) => current),
  map(text => ({ url, todos }) =>
    ajax.post(url, { text, done: false }, HEADERS).pipe(
      map(({ response: todo }) => ({
        url,
        todos: [...todos, todo]
      }))
    )
  )
)

const TodoForm = stream(
  of({ current: "", addTodo }),
  pipe(
    scanPlans({
      onChange,
      clearForm
    }),
    tapWhen(addTodo, clearForm)
  )
)

const toggleTodo = plan(
  map(todo => ({ url, todos }) =>
    ajax
      .patch(
        `${url}/${todo.id}`,
        {
          ...todo,
          done: todo.done ? false : true
        },
        HEADERS
      )
      .pipe(
        map(({ response: todo }) => ({
          url,
          todos: todos.map(_todo => (_todo.id === todo.id ? todo : _todo))
        }))
      )
  )
)

const deleteTodo = plan(
  map(todo => ({ url, todos }) =>
    ajax
      .delete(
        `${url}/${todo.id}`,
        {
          ...todo,
          done: todo.done ? false : true
        },
        HEADERS
      )
      .pipe(
        mapTo({
          url,
          todos: todos.filter(_todo => _todo.id !== todo.id)
        })
      )
  )
)

const Todo = ({ todo, toggleTodo, deleteTodo }) => (
  <li
    style={{
      display: "flex"
    }}
  >
    <span
      style={{
        flex: 1,
        textDecoration: todo.done ? "line-through wavy" : null
      }}
    >
      {todo.text}
    </span>
    <button aria-label={`Toggle ${todo.text}`} onClick={e => toggleTodo(todo)}>
      ✓
    </button>
    <button aria-label={`Delete ${todo.text}`} onClick={e => deleteTodo(todo)}>
      X
    </button>
  </li>
)

const Todos = streamProps(
  pipe(
    switchMap(({ url }) =>
      ajax(url).pipe(map(({ response: todos }) => ({ url, todos })))
    ),
    scanPlans({ toggleTodo, deleteTodo, addTodo })
  )
)

export default () => (
  <div style={{ padding: "2rem", width: "300px" }}>
    <TodoForm>
      {({ current, onChange, addTodo }) => (
        <form
          onSubmit={addTodo}
          style={{ width: "100%", height: "2rem", display: "flex" }}
        >
          <input
            aria-label="Add Todo"
            style={{ flex: "1" }}
            type="text"
            value={current}
            onChange={onChange}
            autoFocus
            placeholder="What needs to be done?"
          />
          <input type="submit" value="Add Todo" />
        </form>
      )}
    </TodoForm>
    <Todos url={url}>
      {({ todos, toggleTodo, deleteTodo }) =>
        todos.map(todo => (
          <Todo key={todo.id} {...{ todo, toggleTodo, deleteTodo }} />
        ))
      }
    </Todos>
  </div>
)
