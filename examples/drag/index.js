import React from "react"
import { plan, stream, scanPlans } from "react-streams"
import { from, fromEvent, merge, concat, of } from "rxjs"
import { map, switchMap, takeUntil, tap, pluck } from "rxjs/operators"

const makeDrag = (middle, end) => start =>
  from(start).pipe(
    pluck("currentTarget"),
    switchMap(currentTarget =>
      from(middle).pipe(
        map(moveEvent => ({
          left: moveEvent.clientX - currentTarget.offsetWidth / 2,
          top: moveEvent.clientY - currentTarget.offsetHeight / 2,
          currentTarget
        })),
        takeUntil(end)
      )
    )
  )

const DragStream = props => {
  const onMouseDown = plan()
  const drag$ = concat(of({}), props.onDrag(onMouseDown))

  return stream(drag$, x => x, { onMouseDown })(props)
}

const onMouseMove = plan()
const onMouseUp = plan()

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
