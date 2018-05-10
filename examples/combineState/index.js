import React from "react"
import {
  combineStateStreams,
  streamToComponent,
  stateToStreams,
  handler,
  mapActions,
  action,
  getTargetValue
} from "react-streams"

import { of } from "rxjs"
import { share } from "rxjs/operators"

import createCountStream from "./createCountStream"
import createNameStream from "./createNameStream"

const countState = { count: 5 }
const nameState = { name: "John" }

const countState$ = createCountStream(countState)
const nameState$ = createNameStream(nameState)

countState$.subscribe(countState => console.log(`countState`, countState))
nameState$.subscribe(nameState => console.log(`nameState`, nameState))

const NameOnlyComponent = streamToComponent(nameState$)
const CountOnlyComponent = streamToComponent(countState$)

const countAndName$ = combineStateStreams(countState$, nameState$)
countAndName$.subscribe(countAndName =>
  console.log(`countAndName`, countAndName)
)

const CountAndNameComponent = streamToComponent(countAndName$)

const containerStyle = {
  border: "3px solid green",
  padding: "1rem",
  margin: "1rem"
}

export default () => (
  <div>
    <NameOnlyComponent>
      {({ name, onUpdate }) => (
        <div id="name" style={containerStyle}>
          <h2>Name Only</h2>
          <input type="text" value={name} onChange={onUpdate} />
          <h3>{name}</h3>
        </div>
      )}
    </NameOnlyComponent>

    <CountOnlyComponent>
      {({ count, onInc, onDec }) => (
        <div id="count" style={containerStyle}>
          <h2>Count Only</h2>
          <h3>{count} apples</h3>
          <button onClick={onInc}>+</button>
          <button onClick={onDec}>-</button>
        </div>
      )}
    </CountOnlyComponent>

    <CountAndNameComponent>
      {({ count, onInc, onDec, name, onUpdate }) => (
        <div id="countAndName" style={containerStyle}>
          <h2>Name and Count Combined</h2>
          <h3>
            {name} has {count} apples
          </h3>
          <button onClick={onInc}>+</button>
          <button onClick={onDec}>-</button>

          <h2>{name}</h2>
          <input type="text" onChange={onUpdate} value={name} />
        </div>
      )}
    </CountAndNameComponent>
  </div>
)
