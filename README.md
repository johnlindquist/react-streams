# ⛲️ react-streams ⛲️

## Install

```bash
npm i react-streams rxjs@rc
```

> Requires rxjs v6 (currently release candidate)

## Hello World

[![Edit 9llmk8p63w](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/9llmk8p63w)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"

const HelloWorld = pipeProps()

render(
  <HelloWorld greeting="Hello" name="react-streams">
    {props => (
      <h1>
        {props.greeting}, {props.name}
      </h1>
    )}
  </HelloWorld>,
  document.querySelector("#root")
)
```

## Operator Example

[![Edit n720r77y0l](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/n720r77y0l)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { map } from "rxjs/operators"

const OperatorExample = pipeProps(
  map(props => ({ message: `${props.message} example` }))
)

render(
  <OperatorExample message="Operator">
    {props => <div>{props.message}</div>}
  </OperatorExample>,
  document.querySelector("#root")
)
```

## Ajax

[![Edit 10911rxp53](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/10911rxp53)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { pluck, switchMap } from "rxjs/operators"
import { ajax } from "rxjs/ajax"

const PersonLoader = pipeProps(pluck("url"), switchMap(ajax), pluck("response"))

const Person = props => (
  <div>
    <h1>{props.name}</h1>
    <img
      src={`https://azure-lipstick.glitch.me/${props.image}`}
      alt={props.name}
    />
  </div>
)

render(
  <PersonLoader url="https://azure-lipstick.glitch.me/people/10">
    {Person}
  </PersonLoader>,
  document.querySelector("#root")
)
```

## Switch to a Stream

[![Edit 1z7yx6my5l](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/1z7yx6my5l)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { interval } from "rxjs"
import { map } from "rxjs/operators"

const Timer = pipeProps(() => interval(1000), map(tick => ({ tick })))

render(
  <Timer>{props => <h1>{props.tick}</h1>}</Timer>,
  document.querySelector("#root")
)
```

## Passing Handlers

[![Edit l9995lm4jl](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/l9995lm4jl)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps, sourceNext } from "react-streams"
import { interval } from "rxjs"
import { map, scan, startWith } from "rxjs/operators"

const [click$, onClick] = sourceNext()

const Counter = pipeProps(
  () => click$,
  startWith(0),
  scan(count => count + 1),
  map(count => ({ count, onClick }))
)

render(
  <Counter>
    {props => (
      <div>
        <h1>{props.count}</h1>
        <button onClick={props.onClick}>+</button>
      </div>
    )}
  </Counter>,
  document.querySelector("#root")
)
```

## Handler Operators

[![Edit jl07wrwnmv](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/jl07wrwnmv)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps, sourceNext } from "react-streams"
import { map, startWith, pluck } from "rxjs/operators"

const [input$, onInput] = sourceNext(
  pluck("target", "value"),
  startWith("Typing Demo")
)

const TypingDemo = pipeProps(props$ => input$, map(text => ({ text, onInput })))

render(
  <TypingDemo>
    {props => (
      <div>
        <input placeholder={props.text} onInput={props.onInput} />
        <h1>{props.text}</h1>
      </div>
    )}
  </TypingDemo>,
  document.querySelector("#root")
)
```

## Proof Props Stream from Parents

[![Edit 5x29k7v3lp](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/5x29k7v3lp)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { interval } from "rxjs"
import { map, pluck } from "rxjs/operators"

const Timer = pipeProps(props$ => interval(1000), map(tick => ({ tick })))

const PropsStreamingDemo = pipeProps(
  pluck("number"),
  map(number => ({ number: number * 2 }))
)

render(
  <Timer>
    {props => (
      <div>
        <h1>{props.tick}</h1>
        <PropsStreamingDemo number={props.tick}>
          {props2 => <h1>{props2.number}</h1>}
        </PropsStreamingDemo>
      </div>
    )}
  </Timer>,
  document.querySelector("#root")
)
```

## Catch Errors

[![Edit qxwr3rk2xj](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/qxwr3rk2xj)

```js
import React from "react"
import { render } from "react-dom"
import { pipeProps } from "react-streams"
import { of } from "rxjs"
import { pluck, switchMap, map, catchError } from "rxjs/operators"
import { ajax } from "rxjs/ajax"

const URL = `https://azure-lipstick.glitch.me/`

const Success = props => (
  <div>
    <h1>{props.name}</h1>
    <img src={URL + props.image} alt={props.name} />
  </div>
)

const Fail = err =>
  of(
    <h1>
      <h1>Failed!!!!</h1>
      <img src={URL + "darth_vader.jpg"} alt="FAILED" />
    </h1>
  )

const CatchDemo = pipeProps(
  map(({ url, person }) => `${url}people/${person}`),
  switchMap(ajax),
  pluck("response"),
  map(Success),
  catchError(Fail)
)

//change the person to an invalid # to force an error
render(<CatchDemo url={URL} person={3333} />, document.querySelector("#root"))
```

### Credits

Heavily inspired by [recompose](https://github.com/acdlite/recompose).
