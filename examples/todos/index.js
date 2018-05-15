import React from "react"
import { Stream, handler } from "react-streams"
import { from, of, pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { concatMap, map, mapTo, pluck } from "rxjs/operators"

const HEADERS = { "Content-Type": "application/json" }

const renderAddTodoForm = ({ current, onSetTodo, onAddTodo }) => (
  <form
    style={{ width: "100%", height: "2rem", display: "flex" }}
    onSubmit={e => {
      e.preventDefault()
      onAddTodo(current)
    }}
  >
    <input
      aria-label="Add Todo"
      style={{ flex: "1" }}
      type="text"
      value={current}
      onChange={onSetTodo}
      autoFocus
      placeholder="What needs to be done?"
    />
    <input type="submit" value="Add Todo" />
  </form>
)

const AddTodoForm = ({ onAddTodo }) => {
  const todo$ = of({ current: "" })
  const onSetTodo = handler(
    pluck("target", "value"),
    map(current => state => ({ current }))
  )

  const clearAfterAdd = from(onAddTodo).pipe(mapTo({ current: "" }))

  return (
    <Stream
      source={todo$}
      merge={{ onSetTodo, clearAfterAdd }}
      onAddTodo={onAddTodo}
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
        textDecoration: todo.done ? "line-through" : null
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

  const handlers = {
    onAddTodo: handler(addTodoAjax, addTodo),
    onToggleDone: handler(toggleDoneAjax, toggleDone),
    onDeleteTodo: handler(deleteTodoAjax, deleteTodo)
  }

  return <Stream source={todos$} merge={handlers} {...props} />
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
