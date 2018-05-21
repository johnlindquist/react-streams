import React from "react"
import { fromPlan, mergePlans, plan, stream, toPlan } from "react-streams"
import { from, merge, of, pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import {
  concatMap,
  filter,
  map,
  mapTo,
  pluck,
  startWith,
  switchMap,
  tap
} from "rxjs/operators"

const wrapInputValue = key =>
  pipe(pluck("target", "value"), map(value => ({ [key]: value })))

//create plans and streams from "onAddTodo"
const addTodoTransform = switchMap(({ onAddTodo, ...props }) => {
  const onChange = plan(wrapInputValue("current"))

  const clearAfterAdd$ = from(onAddTodo).pipe(mapTo({ current: "" }))

  const submit = pipe(
    tap(e => e.preventDefault()),
    fromPlan(onChange, ({ current }) => current),
    filter(text => text !== ""),
    toPlan(onAddTodo)
  )

  const onSubmit = plan(submit)

  return mergePlans(
    { onSubmit, onChange },
    merge(clearAfterAdd$, of({ ...props, current: "" }))
  )
})

const AddTodoForm = stream(addTodoTransform)

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

const HEADERS = { "Content-Type": "application/json" }

const loadTodosFromProps = switchMap(({ url }) =>
  ajax(url).pipe(pluck("response"), startWith([]), map(todos => ({ todos })))
)

const addTodoAjax = pipe(
  switchMap(text => ajax.post(`${url}`, { text, done: false }, HEADERS)),
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

const todosTransform = pipe(
  loadTodosFromProps,
  mergePlans({
    onAddTodo: plan(addTodoAjax, addTodo),
    onToggleDone: plan(toggleDoneAjax, toggleDone),
    onDeleteTodo: plan(deleteTodoAjax, deleteTodo)
  })
)

const Todos = stream(todosTransform)

const addForm = ({ current, onChange, onSubmit }) => (
  <form
    onSubmit={onSubmit}
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
)

export default () => (
  <Todos url={url}>
    {({ todos, onAddTodo, onToggleDone, onDeleteTodo }) => (
      <div style={{ padding: "2rem", width: "300px" }}>
        <AddTodoForm onAddTodo={onAddTodo} render={addForm} />
        <ul style={{ padding: "0", listStyleType: "none" }}>
          {todos.map(todo => (
            <Todo key={todo.id} {...{ todo, onToggleDone, onDeleteTodo }} />
          ))}
        </ul>
      </div>
    )}
  </Todos>
)
