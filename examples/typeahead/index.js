import React from "react"
import { plan, subscribe } from "react-streams"
import { ajax } from "rxjs/ajax"
import {
  debounceTime,
  filter,
  map,
  pluck,
  startWith,
  switchMap
} from "rxjs/operators"

const url = process.env.DEV
  ? "/api/people"
  : "https://dandelion-bonsai.glitch.me/people"

const onInput = plan(
  pluck("target", "value"),
  filter(text => text.length > 1),
  debounceTime(250),
  startWith("john"),
  switchMap(text => ajax(`${url}?username_like=${text}`)),
  pluck("response"),
  startWith([]),
  map(people => ({ people }))
)

const Typeahead = subscribe(onInput)

export default () => (
  <Typeahead>
    {({ people }) => (
      <div>
        <h2>Search a username:</h2>
        <input type="text" onInput={onInput} />
        <ul>
          {people.map(person => (
            <li key={person.id}>
              <h3>{person.username}</h3>
              <img src={person.avatar} alt={person.username} />
            </li>
          ))}
        </ul>
      </div>
    )}
  </Typeahead>
)
