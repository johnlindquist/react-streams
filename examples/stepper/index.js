import React from "react"
import { render } from "react-dom"
import { Stream, plan, converge } from "react-streams"
import { of, from } from "rxjs"
import {
  map,
  mergeScan,
  first,
  tap,
  take,
  share,
  distinctUntilChanged,
  distinctUntilKeyChanged
} from "rxjs/operators"

const StepperControl = ({ min, max, step, ...props }) => {
  const start$ = of({ min, max, step, value: 0 })

  const onUpdateMin = plan(map(e => ({ min: Number(e.target.value) })))
  const onUpdateMax = plan(map(e => ({ max: Number(e.target.value) })))
  const onUpdateStep = plan(map(e => ({ step: Number(e.target.value) })))

  const stepper$ = converge(start$, onUpdateMin, onUpdateMax, onUpdateStep)

  return (
    <Stream
      source={stepper$}
      {...{ onUpdateMin, onUpdateMax, onUpdateStep, ...props }}
    />
  )
}

const start = plan(distinctUntilKeyChanged("value"))
from(start).subscribe(v => console.log(`start`, v))

const Stepper = ({ defaultValue, step, min, max, ...props }) => {
  const onDec = plan(
    map(() => ({ value }) => ({
      value: value - step < min ? value : value - step
    }))
  )
  const onInc = plan(
    map(() => ({ value }) => ({
      value: value + step > max ? value : value + step
    }))
  )
  const onChange = plan(
    map(e => Number(e.target.value)),
    map(value => () => ({ value }))
  )

  const onBlur = plan(
    map(e => Number(e.target.value)),
    map(value => () => ({ value: Math.min(max, Math.max(min, value)) }))
  )

  const value$ = converge(start, onDec, onInc, onChange, onBlur)
  setTimeout(() => {
    start({ value: defaultValue })
  }, 100)

  return (
    <Stream
      source={value$}
      {...{ onDec, onInc, onChange, onBlur, step, min, max, ...props }}
    />
  )
}

export default () => (
  <StepperControl min={4} max={18} step={1}>
    {({ min, max, step, onUpdateMin, onUpdateMax, onUpdateStep }) => (
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            min: <input type="number" value={min} onChange={onUpdateMin} />
          </label>
          <label>
            max: <input type="number" value={max} onChange={onUpdateMax} />
          </label>
          <label>
            step: <input type="number" value={step} onChange={onUpdateStep} />
          </label>
        </div>
        <Stepper defaultValue={10} min={min} max={max} step={step}>
          {({ onDec, value, onBlur, onInc, onChange, min, max, step }) => (
            <div>
              <h2>{JSON.stringify(max)}</h2>
              <button onClick={onDec} aria-label="Increment value">
                -
              </button>
              <input
                style={{ width: "2rem" }}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                type="text"
                aria-label="Set value"
              />
              <button onClick={onInc} aria-label="Decrement value">
                +
              </button>
              <br />

              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
              />
            </div>
          )}
        </Stepper>
      </div>
    )}
  </StepperControl>
)
