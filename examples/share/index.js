import React from "react";
import { streamToComponent } from "react-streams";
import { ajax } from "rxjs/ajax";
import { pluck, map, share } from "rxjs/operators";

const todos$ = ajax("api/todos").pipe(
  pluck("response"),
  map(todos => ({ todos }))
);
const StateContainer = streamToComponent(todos$);

export default () => (
  <div>
    <StateContainer>
      {({ todos }) => (
        <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
      )}
    </StateContainer>

    <div>
      <div>
        <div>
          <div>
            <StateContainer>
              {({ todos }) => (
                <ul>{todos.map(todo => <li key={todo.id}>{todo.text}</li>)}</ul>
              )}
            </StateContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
);
