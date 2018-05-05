import {
  action,
  getTargetValue,
  handler,
  mapActions,
  preventDefault,
  streamProps
} from "react-streams"
import { of } from "rxjs"
import { ajax } from "rxjs/ajax"
import {
  concatMap,
  distinctUntilChanged,
  mapTo,
  pluck,
  switchMap,
  withLatestFrom
} from "rxjs/operators"

const HEADERS = { "Content-Type": "application/json" }

export default streamProps(({ endpoint }) => {
  const onSetTodo = handler(getTargetValue)

  const onAddTodo = handler(
    preventDefault,
    withLatestFrom(onSetTodo, (e, text) => text),
    concatMap(text => ajax.post(`${endpoint}`, { text, done: false }, HEADERS)),
    pluck("response")
  )

  const current$ = mapActions(of(""), [
    action(onSetTodo, text => () => text),
    action(onAddTodo, () => () => "")
  ])

  const onToggleDone = handler(
    concatMap(todo =>
      ajax.patch(
        `${endpoint}/${todo.id}`,
        {
          ...todo,
          done: todo.done ? false : true
        },
        HEADERS
      )
    ),
    pluck("response")
  )

  const onDeleteTodo = handler(
    distinctUntilChanged(),
    concatMap(todo => ajax.delete(`${endpoint}/${todo.id}`).pipe(mapTo(todo)))
  )

  const todos$ = of(`${endpoint}`).pipe(switchMap(ajax), pluck("response"))

  // Can this be expressed better?
  const todosAndActions$ = mapActions(todos$, [
    action(onToggleDone, todo => todos =>
      todos.map(t => (t.id === todo.id ? todo : t))
    ),
    action(onAddTodo, todo => todos => [...todos, todo]),
    action(onDeleteTodo, todo => todos => todos.filter(t => t.id !== todo.id))
  ])

  return {
    todos: todosAndActions$,
    current: current$,
    onToggleDone,
    onSetTodo,
    onAddTodo,
    onDeleteTodo
  }
})
