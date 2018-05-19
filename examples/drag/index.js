import React from "react"
import { Subscribe, plan } from "react-streams"
import { from } from "rxjs"
import { map, pluck, switchMap, takeUntil } from "rxjs/operators"

const onMouseDown = plan()
const onMouseMove = plan()
const onMouseUp = plan()

const onDrag = from(onMouseDown).pipe(
  pluck("currentTarget"),
  switchMap(currentTarget =>
    from(onMouseMove).pipe(
      map(moveEvent => ({
        left: moveEvent.clientX - currentTarget.offsetWidth / 2,
        top: moveEvent.clientY - currentTarget.offsetHeight / 2
      })),
      takeUntil(onMouseUp)
    )
  )
)

export default () => (
  <div
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    style={{ backgroundColor: "whitesmoke", width: "100vw", height: "100vh" }}
  >
    <Subscribe source={onDrag}>
      {({ top, left }) => (
        <div>
          <h2>Drag Demo</h2>
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
  </div>
)
