import React from "react"
import { mergePlans, plan, stream } from "react-streams"
import { pipe, of, range } from "rxjs"
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
  distinctUntilChanged,
  partition
} from "rxjs/operators"

const handleInput = pipe(
  pluck("target", "value"),
  debounceTime(250),
  distinctUntilChanged(),
  filter(term => term.length > 1),
  term$ => term$.pipe(tap(console.log.bind(console))),
  startWith(""),
  map(term => props => {
    return ajax(`${props.url}?username_like=${term || props.term}`).pipe(
      pluck("response"),
      map(people => ({ term: term || props.term, people: people.slice(0, 10) }))
    )
  })
)

const Typeahead = stream(mergePlans({ onChange: plan(handleInput) }))

const url = process.env.DEV
  ? "/api/people"
  : "https://dandelion-bonsai.glitch.me/people"

export default () => (
  <Typeahead url={url} term="jo" people={[]}>
    {({ term, people, onChange }) => (
      <div>
        <h2>Search a username: {term}</h2>
        <input
          type="text"
          onChange={onChange}
          placeholder="Type to seach"
          autoFocus
        />
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
