import React from "react"
import { Stream, converge, plan } from "react-streams"
import { from, pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import {
  concatMap,
  map,
  mapTo,
  pluck,
  startWith,
  tap,
  withLatestFrom
} from "rxjs/operators"

const HEADERS = { "Content-Type": "application/json" }

const renderAddTodoForm = ({ current, onChange, onSubmit }) => (
  <form
    style={{ width: "100%", height: "2rem", display: "flex" }}
    onSubmit={onSubmit}
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
)

const AddTodoForm = ({ onAddTodo }) => {
  const onChange = plan(pluck("target", "value"))
  const current$ = from(onChange).pipe(
    startWith(""),
    map(current => ({ current }))
  )

  const onSubmit = plan(
    tap(e => e.preventDefault()),
    withLatestFrom(onChange, (_, text) => text)
  )
  from(onSubmit).subscribe(onAddTodo)

  const clearAfterAdd$ = from(onAddTodo).pipe(mapTo({ current: "" }))

  const state$ = converge(current$, clearAfterAdd$)

  return (
    <Stream
      source={state$}
      {...{ onChange, onSubmit }}
      render={renderAddTodoForm}
    />
  )
}

const Todo = ({ todo, onToggleDone, onDeleteTodo }) => (
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
    <button
      aria-label={`Toggle ${todo.text}`}
      onClick={e => onToggleDone(todo)}
    >
      ✓
    </button>
    <button
      aria-label={`Delete ${todo.text}`}
      onClick={e => onDeleteTodo(todo)}
    >
      X
    </button>
  </li>
)

// Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
const url = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

const Todos = ({ url, ...props }) => {
  const todos$ = ajax(url).pipe(pluck("response"), map(todos => ({ todos })))

  const addTodoAjax = pipe(
    concatMap(text => ajax.post(`${url}`, { text, done: false }, HEADERS)),
    pluck("response")
  )

  const addTodo = map(todo => ({ todos }) => ({ todos: [...todos, todo] }))

  const toggleDoneAjax = pipe(
    concatMap(todo =>
      ajax.patch(
        `${url}/${todo.id}`,
        {
          ...todo,
          done: todo.done ? false : true
        },
        HEADERS
      )
    ),
    pluck("response")
  )

  const toggleDone = map(todo => state => ({
    todos: state.todos.map(t => (t.id === todo.id ? todo : t))
  }))

  const deleteTodoAjax = pipe(
    concatMap(todo => ajax.delete(`${url}/${todo.id}`).pipe(mapTo(todo)))
  )
  const deleteTodo = map(todo => ({ todos }) => ({
    todos: todos.filter(t => t.id !== todo.id)
  }))

  const onAddTodo = plan(addTodoAjax, addTodo)
  const onToggleDone = plan(toggleDoneAjax, toggleDone)
  const onDeleteTodo = plan(deleteTodoAjax, deleteTodo)

  const state$ = converge(todos$, onAddTodo, onToggleDone, onDeleteTodo)

  return (
    <Stream
      source={state$}
      {...{ ...props, onAddTodo, onToggleDone, onDeleteTodo }}
    />
  )
}

export default () => (
  <Todos url={url}>
    {({ todos, onAddTodo, onToggleDone, onDeleteTodo }) => {
      return (
        <div style={{ padding: "2rem", width: "300px" }}>
          <AddTodoForm onAddTodo={onAddTodo} />
          <ul style={{ padding: "0", listStyleType: "none" }}>
            {todos.map(todo => (
              <Todo key={todo.id} {...{ todo, onToggleDone, onDeleteTodo }} />
            ))}
          </ul>
        </div>
      )
    }}
  </Todos>
)
