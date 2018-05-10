import { action, handler, stateToStreams, mapActions } from "react-streams"
import { of } from "rxjs"
import { tap } from "rxjs/operators"

export default stateToStreams(({ count }) => {
  const onInc = handler()
  const onDec = handler()

  const count$ = mapActions(of(count), [
    action(onInc, () => count => count + 1),
    action(onDec, () => count => count - 1)
  ])

  return {
    count: count$,
    onInc,
    onDec
  }
})
