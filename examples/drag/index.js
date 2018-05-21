import React from "react"
import { plan, Stream, mergePlans } from "react-streams"
import { from, fromEvent, merge, concat, of } from "rxjs"
import { map, switchMap, takeUntil, tap, pluck } from "rxjs/operators"

const onMouseMove = plan()
const onMouseUp = plan()

const onDrag = onMouseDown =>
  from(onMouseDown).pipe(
    pluck("currentTarget"),
    switchMap(currentTarget =>
      from(onMouseMove).pipe(
        map(moveEvent => ({
          left: moveEvent.clientX - currentTarget.offsetWidth / 2,
          top: moveEvent.clientY - currentTarget.offsetHeight / 2,
          currentTarget
        })),
        takeUntil(onMouseUp)
      )
    )
  )

const DraggableBox = ({ onDrag, children }) => {
  const onMouseDown = plan()
  const drag$ = concat(of({}), onDrag(onMouseDown))

  return <Stream source={drag$} plans={{ onMouseDown }} children={children} />
}

export default () => (
  <div
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    style={{ backgroundColor: "whitesmoke", width: "100vw", height: "100vh" }}
  >
    <h2>Drag Demo</h2>
    <DraggableBox onDrag={onDrag}>
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
    </DraggableBox>

    <DraggableBox onDrag={onDrag}>
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
    </DraggableBox>
    <DraggableBox onDrag={onDrag}>
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
    </DraggableBox>
  </div>
)
