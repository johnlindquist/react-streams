# ⛲️ react-streams ⛲️

Heavily inspired by `recompose`.

## Hello World

```js
import React from "react"
import { render } from "react-dom"
import { streamPropsToComponent } from "react-streams"
import { map } from "rxjs/operators"

const HelloWorld = streamPropsToComponent(props$ =>
  props$.pipe(map(props => <h1>{props.message}</h1>))
)

render(<HelloWorld message="Hello world" />, document.querySelector("#root"))
```

## Counter

[![Edit 9l3167kzxy](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/9l3167kzxy)

```js
import React from "react"
import { render } from "react-dom"
import { streamPropsToComponent, subjectHandlerPair } from "react-streams"
import { map, mapTo, switchMap, scan, startWith, pluck } from "rxjs/operators"

const Counter = streamPropsToComponent(props$ => {
  const [click$, onClick] = subjectHandlerPair(startWith(null), mapTo(2))

  return props$.pipe(
    pluck("start"),
    //note: if the prop changes, `switchMap` will reset the count to the new prop
    switchMap(start => click$.pipe(scan((acc, curr) => acc + curr, start))),
    map(count => (
      <div>
        <button onClick={onClick}>{count}</button>
      </div>
    ))
  )
})

render(<Counter start={3} />, document.querySelector("#root"))
```
