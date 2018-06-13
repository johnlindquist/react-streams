import React from "react"
import { plan, stream, assign } from "react-streams"
import { concat, from, of } from "rxjs"
import {
  map,
  pluck,
  switchMap,
  takeUntil,
  startWith,
  tap
} from "rxjs/operators"

const makeDrag = (move, end) => start =>
  from(start).pipe(
    pluck("currentTarget"),
    tap(value => console.log(value)),
    switchMap(
      currentTarget =>
        console.log({ start, move, end }) ||
        from(move).pipe(
          tap(value => console.log(`onMouseMove`, value)),
          map(moveEvent => ({
            left: moveEvent.clientX - currentTarget.offsetWidth / 2,
            top: moveEvent.clientY - currentTarget.offsetHeight / 2,
            currentTarget
          })),
          takeUntil(end)
        )
    ),
    startWith({})
  )

const DragStream = props => {
  const onMouseDown = plan(tap(value => console.log(`onMouseDown`, value)))
  const drag$ = props.onDrag(onMouseDown).pipe(assign({ onMouseDown }))

  return stream(drag$)(props)
}

const onMouseMove = plan()
const onMouseUp = plan(tap(value => console.log(`onMouseUp`, value)))

export default () => (
  <div
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    style={{ backgroundColor: "whitesmoke", width: "100vw", height: "100vh" }}
  >
    <h2>Drag Demo</h2>
    <DragStream onDrag={makeDrag(onMouseMove, onMouseUp)}>
      {({ top, left, onMouseDown }) => (
        <div>
          <div
            onMouseDown={onMouseDown}
            style={{
              width: 100,
              height: 100,
              position: "absolute",
              backgroundColor: "red",
              border: "5px solid black",
              top,
              left
            }}
          />
        </div>
      )}
    </DragStream>

    <DragStream onDrag={makeDrag(onMouseMove, onMouseUp)}>
      {({ top, left, onMouseDown }) => (
        <div>
          <div
            onMouseDown={onMouseDown}
            style={{
              width: 50,
              height: 50,
              position: "absolute",
              backgroundColor: "yellow",
              border: "5px solid black",
              top,
              left
            }}
          />
        </div>
      )}
    </DragStream>
    <DragStream onDrag={makeDrag(onMouseMove, onMouseUp)}>
      {({ top, left, onMouseDown }) => (
        <div>
          <div
            onMouseDown={onMouseDown}
            style={{
              width: 25,
              height: 25,
              position: "absolute",
              backgroundColor: "green",
              border: "5px solid black",
              top,
              left
            }}
          />
        </div>
      )}
    </DragStream>
  </div>
)
