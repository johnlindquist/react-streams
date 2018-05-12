import React from "react"
import { Stream } from "react-streams"
import { ajax } from "rxjs/ajax"
import { pluck, switchMap } from "rxjs/operators"

const endpoint = process.env.DEV
  ? "/api/todos"
  : "https://dandelion-bonsai.glitch.me/todos"

const state = {
  endpoint,
  id: 1
}
const ops = [
  switchMap(({ endpoint, id }) => ajax(`${endpoint}/${id}`)),
  pluck("response")
]

export default () => (
  <Stream state={state} pipe={ops}>
    {({ text, id }) => (
      <div>
        {id}. {text}
      </div>
    )}
  </Stream>
)
