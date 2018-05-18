import React, { createContext } from "react"
import { Subscribe, converge, plan, assign } from "react-streams"
import { merge, of } from "rxjs"
import { map, mapTo, pluck } from "rxjs/operators"

const name$ = of({ name: "John" })
const onUpdate = plan(pluck("target", "value"), map(name => () => ({ name })))

const nameState$ = name$.pipe(converge({ onUpdate }))

const count$ = of({ count: 5 })
const onInc = plan(mapTo(({ count }) => ({ count: count + 1 })))
const onDec = plan(mapTo(({ count }) => ({ count: count - 1 })))

const countState$ = count$.pipe(converge({ onInc, onDec }))

const source = assign(nameState$, countState$)

const { Consumer } = createContext({ source })

const NameAndCountStream = props => (
  <Consumer
    children={context => (
      <Subscribe source={context.source} render={props.render} />
    )}
  />
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
