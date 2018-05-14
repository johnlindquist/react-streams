import React from "react"
import { Stream, handler } from "react-streams"
import { concatMap, map, mapTo, pluck, switchMap, tap } from "rxjs/operators"
import { of, pipe } from "rxjs"
import { ajax } from "rxjs/ajax"

const HEADERS = { "Content-Type": "application/json" }

const AddTodoForm = ({ onAddTodo, onSetTodo, current }) => (
  <form
    style={{ width: "100%", height: "2rem", display: "flex" }}
    onSubmit={onAddTodo}
  >
    <input
      aria-label="Add Todo"
      style={{ flex: "1" }}
      type="text"
      onChange={onSetTodo}
      value={current}
      autoFocus
      placeholder="What needs to be done?"
    />
    <input type="submit" value="Add Todo" />
  </form>
)

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
    onToggleDone: handler(toggleDoneAjax, toggleDone),
    onDeleteTodo: handler(deleteTodoAjax, deleteTodo)
  }

  return <Stream source={todos$} handlers={handlers} {...props} />
}

export default () => (
  <Todos url={url}>
    {({ todos, current }, handlers) => (
      <div style={{ padding: "2rem", width: "300px" }}>
        <ul style={{ padding: "0", listStyleType: "none" }}>
          {todos.map(todo => <Todo key={todo.id} todo={todo} {...handlers} />)}
        </ul>
        {/* <AddTodoForm
          onAddTodo={onAddTodo}
          onSetTodo={onSetTodo}
          current={current}
        />
        <ul style={{ padding: "0", listStyleType: "none" }}>
          {todos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              onToggleDone={onToggleDone}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul> */}
      </div>
    )}
  </Todos>
)
