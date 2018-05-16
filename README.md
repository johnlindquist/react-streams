# react-streams

```bash
npm i react-streams rxjs
```

<img src="https://rawgit.com/johnlindquist/react-streams/master/logo.svg" alt="react-streams logo" width="300px;"/>

## Play with Examples at [codesandbox.io](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%2Fhello%2Findex.js)

`react-streams` provides three features:

1.  `<Stream source={}/>` - Subscribes to a `source` prop and renders into `props.children`
2.  `plan(...operators)` - Creates a function that can `merge` with `source`. Invoke the function to update `source`
3.  `converge(source$, plan1, plan2, plan3, ...)` - Creates `sources` using the `merge` then `scan` pattern

## `<Stream>` from a `source` with Operators

The `<Stream>` component will subscribe to what you pass into the `source` prop.
The result will be passed into the "render prop" function of either `props.children`
or `props.render`.

Configure your `source` stream however you want. You can delay, debounce, startWith,
etc, etc, etc.

```js
import React from "react"
import { Stream } from "react-streams"
import { delay, startWith } from "rxjs/operators"
import { of } from "rxjs"

const source$ = of({ message: "Hello" }).pipe(
  delay(1000),
  startWith({ message: "Wait..." })
)

export default () => (
  <Stream source={source$}>{({ message }) => <div>{message}</div>}</Stream>
)
```

## Configure a `<Stream>` with Props (Ajax Demo)

Use `props` to configure your `<Stream>` by wrapping it with another `Component`.
Then pass whatever props you want to use to the `<Stream>` and make sure you
pass `props.children` (or just `{...props}`) so the `<Stream>` has something
to render.

```js
import React from "react"
import { Stream } from "react-streams"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"
import { of } from "rxjs"

// Get your own, free todos API 🙌 https://glitch.com/edit/#!/import/github/johnlindquist/todos-api
const url = "https://dandelion-bonsai.glitch.me/todos"

const Todo = ({ url, id, ...props }) => {
  const todo$ = of({ url, id }).pipe(
    switchMap(({ url, id }) => ajax(`${url}/${id}`)),
    pluck("response")
  )
  //the `Stream` needs `props.children`, so I'm passing all the props
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
```

## Make a `Plan`

A `plan` creates a function you invoke to push values into the `<Stream>`.
Exactly like the "RxJS" `pipe`, a `plan` will group together operators to work on
values in a sequence. Notice how `onChange` grabs the `target.value`, `delay`s 250 ms,
and then pushes a message Object.

`merge` together your `source` and your `plan`s, then `scan` them together.
(We'll talk more about this pattern in the `converge` section.)

Now you can invoke the `onChange` plan wherever you want to update the `<Stream>`.

```js
import React from "react"
import { Stream, plan } from "react-streams"
import { merge, of } from "rxjs"
import { delay, map, pluck, scan } from "rxjs/operators"

const text$ = of({ message: "Hello" })

const onChange = plan(
  pluck("target", "value"),
  delay(250),
  map(message => ({ message }))
)

const state$ = merge(text$, onChange).pipe(
  scan((state = {}, patch) => {
    return { ...state, ...patch }
  })
)

export default () => (
  <Stream source={state$} onChange={onChange}>
    {({ message, onChange }) => (
      <div>
        <input id="input" type="text" onChange={onChange} />
        <div id="message">{message}</div>
      </div>
    )}
  </Stream>
)
```

## Merge `Plans` to Create a `source`

This "counter" demo shows how many `plans` can work together to update a source.
Pass them all into `merge` (or use the `converge` helper in the next Demo :))
then invoke them when needed.

The `merge` then `scan` pattern will wire them all together to keep your state
in sync.

```js
import React from "react"
import { Stream, plan } from "react-streams"
import { merge, of } from "rxjs"
import { map, scan } from "rxjs/operators"

const Count = ({ start, ...props }) => {
  const count$ = of({ count: start })
  const onInc = plan(map(() => state => ({ count: state.count + 2 })))
  const onDec = plan(map(() => state => ({ count: state.count - 2 })))
  const onReset = plan(map(() => state => ({ count: 4 })))

  const state$ = merge(count$, onInc, onDec, onReset).pipe(
    scan((state = {}, updater) => updater(state))
  )
  return <Stream source={state$} {...{ onInc, onDec, onReset, ...props }} />
}

export default () => (
  <Count start={4}>
    {({ count, onInc, onDec, onReset }) => (
      <div>
        <button id="dec" onClick={onDec} aria-label="decrement">
          -
        </button>
        <span id="count" aria-label="count">
          {count}
        </span>
        <button id="inc" onClick={onInc} aria-label="increment">
          +
        </button>
        <button onClick={onReset} aria-label="reset">
          Reset
        </button>
      </div>
    )}
  </Count>
)
```

## Converge

`converge` is a utility around the `merge` then `scan` pattern from the
last two demos. With `converge`, your `plans` can return either a function or an
object to update/patch the state as shown below.

```js
import React from "react"
import { Stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { map, mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const date = plan(
  map(() => ({
    message: new Date().toLocaleDateString()
  }))
)
const bye = plan(mapTo({ message: "Bye" }))
const yo = plan(mapTo({ message: "Yo" }))

const state$ = converge(message$, date, bye, yo)

export default () => (
  <div>
    <Stream source={state$}>
      {({ message }) => (
        <div>
          <div id="message">{message}</div>
          <button onClick={date} aria-label="show date message">
            Date
          </button>
          <button onClick={bye} aria-label="show bye message">
            Bye
          </button>
          <button onClick={yo} aria-label="show yo message">
            Yo
          </button>
        </div>
      )}
    </Stream>
  </div>
)
```

## Todos App (with Ajax)

The `Todos` app below uses `plans` that talk to a backend. Each "add", "patch",
and "delete" operation does a round-trip before coming back to update the UI.

The `<AddTodoForm>` demonstrates how `plans` can talk to each other. `onSubmit`
can trigger an `onAddTodo` and `clearAfterAdd$` can listen for `onAddTodo` to
push the next value.

There are quite a few operators working together in `pipes` inside `plans`.
`react-streams` strongly encourages creating reusable `pipes` of operators

```js
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
```

## Use `Context` for Global Streams

Pass `source`s globally using React's `Context` api. As long as your `source` and
`plans` converge, you can then pass them anywhere in your app to display or
update values.

```js
import React, { createContext } from "react"
import { Stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { mapTo } from "rxjs/operators"

const message$ = of({ message: "Hello" })
const bye = plan(mapTo({ message: "Bye" }))
const yo = plan(mapTo({ message: "Yo" }))
const source = converge(message$, bye, yo)

const { Consumer } = createContext({ source, bye, yo })

export default () => (
  <div>
    <Consumer>
      {({ source }) => (
        <Stream source={source}>
          {({ message }) => <h2 id="message">{message}</h2>}
        </Stream>
      )}
    </Consumer>

    <div>
      <div>
        <div>
          <Consumer>
            {({ bye, yo }) => (
              <div>
                <button onClick={bye} aria-label="show bye message">
                  Bye
                </button>
                <button onClick={yo} aria-label="show yo message">
                  Yo
                </button>
              </div>
            )}
          </Consumer>
        </div>
      </div>
    </div>
  </div>
)
```

## `Converge` Multiple Sources

You can `converge` as many sources and `plans` as you like. Just remember that
`plans` will operate on the source at the level they are "converged"

```js
import React, { createContext } from "react"
import { Stream, converge, plan } from "react-streams"
import { of } from "rxjs"
import { map, mapTo, pluck } from "rxjs/operators"

const name$ = of({ name: "John" })
const onUpdate = plan(pluck("target", "value"), map(name => () => ({ name })))

const nameState$ = converge(name$, onUpdate)

const count$ = of({ count: 5 })
const onInc = plan(mapTo(({ count }) => ({ count: count + 1 })))
const onDec = plan(mapTo(({ count }) => ({ count: count - 1 })))

const countState$ = converge(count$, onInc, onDec)

const source = converge(nameState$, countState$)

const { Consumer } = createContext({ source, onUpdate, onInc, onDec })

const NameAndCountStream = props => (
  <Consumer children={context => <Stream {...{ ...context, ...props }} />} />
)

const NameOnlyComponent = ({ name, onUpdate }) => (
  <div id="name" style={containerStyle}>
    <h2>Name Only</h2>
    <input type="text" value={name} onChange={onUpdate} />
    <h3>{name}</h3>
  </div>
)

const CountOnlyComponent = ({ count, onInc, onDec }) => (
  <div id="count" style={containerStyle}>
    <h2>Count Only</h2>
    <h3>{count} apples</h3>
    <button onClick={onInc}>+</button>
    <button onClick={onDec}>-</button>
  </div>
)

const NameAndCountComponent = ({ count, onInc, onDec, name, onUpdate }) => (
  <div id="countAndName" style={containerStyle}>
    <h2>Name and Count</h2>
    <h3>
      {name} has {count} apples
    </h3>
    <button onClick={onInc}>+</button>
    <button onClick={onDec}>-</button>

    <h2>{name}</h2>
    <input type="text" onChange={onUpdate} value={name} />
  </div>
)

const containerStyle = {
  border: "3px solid green",
  padding: "1rem",
  margin: "1rem"
}
export default () => (
  <div>
    <NameAndCountStream render={NameOnlyComponent} />
    <NameAndCountStream render={CountOnlyComponent} />
    <NameAndCountStream render={NameAndCountComponent} />
  </div>
)
```
