import {
  action,
  getTargetValue,
  handler,
  stateToStreams,
  mapActions
} from "react-streams"
import { of } from "rxjs"

export default stateToStreams(({ name }) => {
  const onUpdate = handler(getTargetValue)

  const name$ = mapActions(of(name), [action(onUpdate, name => () => name)])

  return {
    name: name$,
    onUpdate
  }
})
