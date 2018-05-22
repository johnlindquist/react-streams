import React from "react"
import { mergePlans, plan, streamProps } from "react-streams"
import { pipe } from "rxjs"
import { ajax } from "rxjs/ajax"
import { debounceTime, distinctUntilChanged, map, pluck } from "rxjs/operators"

const handleInput = pipe(
  pluck("target", "value"),
  debounceTime(250),
  distinctUntilChanged(),
  /**
   * map to a fn which returns an object, fn, or Observable (which returns an
   * object, fn, or Observable)
   */
  map(term => props => {
    if (term.length < 2) return { people: [], term: "" }
    return ajax(`${props.url}?username_like=${term}`).pipe(
      pluck("response"),
      map(people => ({ term, people: people.slice(0, 10) }))
    )
  })
)

const Typeahead = streamProps(mergePlans({ onChange: plan(handleInput) }))

const url = process.env.DEV
  ? "/api/people"
  : "https://dandelion-bonsai.glitch.me/people"

export default () => (
  <Typeahead url={url} people={[]}>
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
