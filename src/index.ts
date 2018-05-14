import { Component, ReactNode, ComponentClass, StatelessComponent } from "react"
import {
  MonoTypeOperatorFunction,
  ObservableInput,
  OperatorFunction,
  Subject,
  combineLatest,
  concat,
  from,
  merge,
  observable,
  Observable,
  of,
  pipe
} from "rxjs"
import {
  distinctUntilChanged,
  map,
  pluck,
  scan,
  share,
  startWith,
  switchMap,
  switchMapTo,
  tap,
  mapTo
} from "rxjs/operators"

import { handler, SourceType } from "rx-handler"

const config = (props, context) => {
  console.log({ source, handlers })
  const {
    source,
    handlers = {
      next: handler(map(payload => state => ({ ...state, ...payload })))
    }
  } = props

  context.handlers = handlers

  console.log({ props })
  const state$ = source.pipe(map(state => state))
  return merge(state$, ...Object.values(handlers)).pipe(
    scan((state, fnOrObj) => {
      console.log({ state, fnOrObj })
      if (!state) return fnOrObj()
      if (fnOrObj instanceof Function) {
        return { ...state, ...fnOrObj(state) }
      } else {
        return { ...state, ...fnOrObj }
      }
    })
  )
}

class Stream extends Component<
  {
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  subscription
  handlers
  cDU = handler()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  componentDidMount() {
    this.subscription = config(this.props, this).subscribe(state =>
      this.setState(() => state)
    )
  }

  render() {
    console.log(`render`, this.state, this.handlers)
    return this.subscription ? this.__renderFn(this.state, this.handlers) : null
  }

  componentDidUpdate() {
    this.cDU()
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

export { handler, SourceType, Stream, config }
