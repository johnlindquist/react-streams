import React from "react"
import { plan, Subscribe } from "react-streams"
import { from, fromEvent, merge } from "rxjs"
import {
  map,
  switchMap,
  takeUntil,
  tap,
  pluck,
  subscribeOn
} from "rxjs/operators"

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

const DraggableBox = ({ onDrag }) => {
  const onMouseDown = plan()

  return subscribe(onDrag)
  return (
    <Subscribe source={onDrag(onMouseDown)}>
      {({ top, left, currentTarget }) => (
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
    </Subscribe>
  )
}

export default () => (
  <div
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    style={{ backgroundColor: "whitesmoke", width: "100vw", height: "100vh" }}
  >
    <h2>Drag Demo</h2>

    <DraggableBox onDrag={onDrag} />
    <DraggableBox onDrag={onDrag} />
    <DraggableBox onDrag={onDrag} />
  </div>
)
