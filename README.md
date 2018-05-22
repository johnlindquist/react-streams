# react-streams

```bash
npm i react-streams rxjs
```

<p align="center">

<img src="https://rawgit.com/johnlindquist/react-streams/master/logo.svg" alt="react-streams logo" width="300px;"/>
</p>

## Play with Examples at [codesandbox.io](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%2Fstream%2Findex.js)

## `stream`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%2stream%2Findex.js)

```js
import React from "react"
import { stream } from "react-streams"
import { interval } from "rxjs"
import { map } from "rxjs/operators"

const count$ = interval(250).pipe(map(count => ({ count })))

const Counter = stream(count$)

export default () => (
  <div>
    <h2>Subscribe to a Stream</h2>
    <Counter>{({ count }) => <div>{count}</div>}</Counter>
  </div>
)
```

## `pipe`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%pipe%2Findex.js)

```js
import React from "react"
import { stream } from "react-streams"
import { of } from "rxjs"
import { map } from "rxjs/operators"

const stream$ = of({ greeting: "Hello", name: "world" })

const mapToMessage = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

const Greeting = stream(stream$, mapToMessage)

export default () => (
  <div>
    <h2>Pipe Stream Values</h2>
    <Greeting>{({ message }) => <div>{message}</div>}</Greeting>
  </div>
)
```

## `streamProps`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%2streamProps%2Findex.js)

```js
import React from "react"
import { streamProps } from "react-streams"
import { map } from "rxjs/operators"

const mapGreeting = map(({ greeting, name }) => ({
  message: `${greeting}, ${name}!`
}))

const HelloWorld = streamProps(mapGreeting)

export default () => (
  <div>
    <h2>Stream Props to Children</h2>
    <HelloWorld greeting="Hello" name="world">
      {({ message }) => <div>{message}</div>}
    </HelloWorld>
    <HelloWorld greeting="Bonjour" name="John">
      {({ message }) => <div>{message}</div>}
    </HelloWorld>
  </div>
)
```

## `<Stream/>`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%generic%2Findex.js)

```js
import React from "react"
import { Stream } from "react-streams"
import { of, pipe } from "rxjs"
import { delay, startWith } from "rxjs/operators"

const startWithAndDelay = (message, time) =>
  pipe(delay(time), startWith({ message }))

const message$ = of({ message: "Hello" })

export default () => (
  <div>
    <h2>Stream as a Component</h2>
    <Stream source={message$} pipe={startWithAndDelay("Wait...", 500)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
    <Stream source={message$} pipe={startWithAndDelay("Wait longer...", 3000)}>
      {({ message }) => <div>{message}</div>}
    </Stream>
  </div>
)
```

## Ajax

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%ajax%2Findex.js)

```js
import React from "react"
import { streamProps } from "react-streams"
import { pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap, startWith } from "rxjs/operators"

const getTodo = pipe(
  switchMap(({ url, id }) => ajax(`${url}/${id}`)),
  pluck("response")
)

const Todo = streamProps(getTodo)

const url = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

export default () => (
  <div>
    <h2>Ajax Demo</h2>
    <Todo url={url} id={2}>
      {({ text, id }) => (
        <div>
          {id}. {text}
        </div>
      )}
    </Todo>
    <Todo url={url} id={3}>
      {({ text, id }) => (
        <div>
          {id}. {text}
        </div>
      )}
    </Todo>
  </div>
)
```

## Nested Streams

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%nested%2Findex.js)

```js
import React from "react"
import { Stream, StreamProps } from "react-streams"
import { map, filter } from "rxjs/operators"
import { interval } from "rxjs"

const count$ = interval(1000).pipe(map(count => ({ count })))

const odds = filter(({ count }) => count % 2)
const evens = filter(({ count }) => !(count % 2))

export default () => (
  <Stream source={count$}>
    {({ count }) => (
      <div style={{ padding: "2rem" }}>
        <h2>Stream with Nested StreamProps Components</h2>
        <StreamProps count={count}>
          {({ count }) => <div>No filter: {count}</div>}
        </StreamProps>
        <StreamProps count={count} pipe={odds}>
          {({ count }) => <div>Odds: {count}</div>}
        </StreamProps>
        <StreamProps count={count} pipe={evens}>
          {({ count }) => <div>Evens: {count}</div>}
        </StreamProps>
      </div>
    )}
  </Stream>
)
```

## Create a `plan`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%plans%2Findex.js)

```js
import React from "react"
import { StreamProps, plan } from "react-streams"
import { map, pluck } from "rxjs/operators"

const onChange = plan(pluck("target", "value"), map(message => ({ message })))

export default () => (
  <div>
    <h2>Update a Stream with Plans</h2>
    <StreamProps message="Hello" plans={{ onChange }}>
      {({ message, onChange }) => (
        <div>
          <input id="input" type="text" onChange={onChange} />
          <div id="message">{message}</div>
        </div>
      )}
    </StreamProps>
  </div>
)
```

## `mergePlans`

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%plans%2Findex.js)

```js
import React from "react"
import { mergePlans, plan, streamProps } from "react-streams"
import { pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { debounceTime, distinctUntilChanged, map, pluck } from "rxjs/operators"

const handleInput = pipe(
  pluck("target", "value"),
  debounceTime(250),
  distinctUntilChanged(),
  /**
   * map to a fn which returns an object, fn, or Observable (which returns an
   * object, fn, or Observable)
   */
  map(term => props => {
    if (term.length < 2) return { people: [], term: "" }
    return ajax(`${props.url}?username_like=${term}`).pipe(
      pluck("response"),
      map(people => ({ term, people: people.slice(0, 10) }))
    )
  })
)

const Typeahead = streamProps(mergePlans({ onChange: plan(handleInput) }))

const url = process.env.DEV
  ? "/api/people"
  : "https://dandelion-bonsai.glitch.me/people"

export default () => (
  <Typeahead url={url} people={[]}>
    {({ term, people, onChange }) => (
      <div>
        <h2>Search a username: {term}</h2>
        <input
          type="text"
          onChange={onChange}
          placeholder="Type to seach"
          autoFocus
        />
        <ul>
          {people.map(person => (
            <li key={person.id} style={{ height: "25px" }}>
              <span>{person.username}</span>
              <img
                style={{ height: "100%" }}
                src={person.avatar}
                alt={person.username}
              />
            </li>
          ))}
        </ul>
      </div>
    )}
  </Typeahead>
)
```

## Counter Demo

[Demo here](https://codesandbox.io/s/github/johnlindquist/react-streams/tree/master/examples?module=%counter%2Findex.js)

```js
import React from "react"
import { mergePlans, plan, streamProps } from "react-streams"
import { map } from "rxjs/operators"

const onInc = plan(map(() => state => ({ count: state.count + 2 })))
const onDec = plan(map(() => state => ({ count: state.count - 2 })))
const onReset = plan(map(() => state => ({ count: 4 })))

const Counter = streamProps(mergePlans({ onInc, onDec, onReset }))

export default () => (
  <Counter count={4}>
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
  </Counter>
)
```
