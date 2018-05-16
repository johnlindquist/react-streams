import React from "react"
import { Stream, converge, plan } from "react-streams"
import { of, merge, pipe } from "rxjs"
import { map, tap, withLatestFrom, combineLatest, scan } from "rxjs/operators"

const StepperControl = ({ min, max, step, ...props }) => {
  const start$ = of({ min, max, step, value: 0 })

  const onUpdateMin = plan(map(e => ({ min: Number(e.target.value) })))
  const onUpdateMax = plan(map(e => ({ max: Number(e.target.value) })))
  const onUpdateStep = plan(map(e => ({ step: Number(e.target.value) })))

  const control$ = converge(start$, onUpdateMin, onUpdateMax, onUpdateStep)

  return (
    <Stream
      source={control$}
      {...{ onUpdateMin, onUpdateMax, onUpdateStep, ...props }}
    />
  )
}

const Stepper = ({ min, max, step, defaultValue, ...props }) => {
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
    map(({ value }) => () => ({
      value: Math.min(max, Math.max(min, value))
    }))
  )

  const value$ = converge(
    of({ value: defaultValue }),
    onDec,
    onInc,
    onChange,
    onBlur
  )

  const changePipe = pipe(
    scan((prev, next) => {
      console.table({ prev, next })
      if (
        prev.min != next.min ||
        prev.max != next.max ||
        prev.step != next.step
      ) {
        console.log(`min or max or step changed`)
        return { ...next, value: prev.value }
      } else {
        return next
      }
    })
  )
  return (
    <Stream
      source={value$}
      {...{ ...props, min, max, step, onDec, onInc, onChange, onBlur }}
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
