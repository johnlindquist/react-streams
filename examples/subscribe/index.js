import React from "react"
import { subscribe } from "react-streams"
import { of } from "rxjs"
import { switchMap } from "rxjs/operators"

const message$ = of({ greeting: "Hello", name: "world" })

const HelloSubscribe = subscribe(
  message$,
  switchMap(({ greeting, name }) => of({ message: `${greeting}, ${name}` }))
)

export default () => (
  <HelloSubscribe>{({ message }) => <h2>{message}</h2>}</HelloSubscribe>
)
