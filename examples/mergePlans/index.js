import React from "react"
import { mergePlans, plan, stream } from "react-streams"
import { pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import {
  debounceTime,
  filter,
  map,
  pluck,
  startWith,
  switchMap,
  switchAll,
  tap,
  distinctUntilChanged
} from "rxjs/operators"

const handleInput = pipe(
  pluck("target", "value"),
  filter(term => term.length > 1),
  debounceTime(250),
  distinctUntilChanged(),
  map(term => props => {
    console.log({ term, props })
    return ajax(`${props.url}?username_like=${term || props.term}`).pipe(
      pluck("response"),
      map(people => ({ term, people: people.slice(0, 10) }))
    )
  })
)

const Typeahead = stream(mergePlans({ onChange: plan(handleInput) }))

const url = process.env.DEV
  ? "/api/people"
  : "https://dandelion-bonsai.glitch.me/people"

export default () => (
  <Typeahead url={url} term="jo">
    {({ term, people = [], onChange }) => (
      <div>
        <h2>Search a username: {term}</h2>
        <input type="text" value={term} onChange={onChange} />
        <ul>
          {people.map(person => (
            <li key={person.id} style={{ height: "25px" }}>
              <span>{person.username}</span>
              <img
                style={{ height: "100%" }}
                src={person.avatar}
                alt={person.username}
              />
            </li>
          ))}
        </ul>
      </div>
    )}
  </Typeahead>
)
