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
  of
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

class Stream extends Component<
  {
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  setState$ = new Subject()
  subscription

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  componentDidMount() {
    console.log(this.props)
    const ops = [
      startWith(this.props),
      distinctUntilChanged(),
      switchMap(({ state, handlers, pipe = [] }) => {
        console.log({ state, handlers, pipe })
        if (handlers && state) {
          this.handlers = handlers
          return concat(of(state), merge(...Object.values(handlers))).pipe(
            scan((state, fnOrObj) => {
              if (fnOrObj instanceof Function) {
                return { ...state, ...fnOrObj(state) }
              } else {
                return { ...state, ...fnOrObj }
              }
            }),
            ...pipe
          )
        }
        if (state) {
          return of(state).pipe(...pipe)
        }
      })
    ]

    this.subscription = this.setState$
      .pipe(...ops)
      .subscribe(state => this.setState(() => state))
  }

  render() {
    console.log(`render`, this.state, this.handlers)
    return this.subscription ? this.__renderFn(this.state, this.handlers) : null
  }

  componentDidUpdate() {
    this.setState$.next(this.props)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

const mapPropsToObjectOfStreams = props => {
  const entries = Object.keys(props).map(key => [key, props[key]])

  const handlerEntries = entries.filter(([_, v]) => v instanceof Function)
  const handlerProps = handlerEntries.reduce(
    (acc, curr) => ({
      ...acc,
      [curr[0]]: curr[1]
    }),
    {}
  )

  const streamEntries = entries.filter(([_, v]) => !(v instanceof Function))
  const streams = streamEntries.map(([_, v]) => v)
  const streamKeys = streamEntries.map(([v]) => v)

  return combineLatest(...streams, (...args) => {
    const streamProps = args.reduce((props, arg, i) => {
      return {
        ...props,
        [streamKeys[i]]: arg
      }
    }, {})

    return {
      ...streamProps,
      ...handlerProps
    }
  })
}

const switchMapPropsToObjectOfStreams = fn =>
  switchMap(props => mapPropsToObjectOfStreams(fn(props)))

function streamProps<T>(fn) {
  return componentFromOps(switchMapPropsToObjectOfStreams(fn))
}

const mapActions = (stream, actions) =>
  concat(stream, merge(...actions)).pipe(
    scan((value, fn: Function) => fn(value))
  )

const action = (src, reducer) => from(src).pipe(map(reducer))

const preventDefault: MonoTypeOperatorFunction<Event> = tap((e: Event) =>
  e.preventDefault()
)
const getTargetValue = pluck("currentTarget", "value")

const stateToStreams = fn => state => mapPropsToObjectOfStreams(fn(state))

const streamState = fn => state =>
  componentFromOps(switchMapTo(stateToStreams(fn)(state)), share())

const combineStateStreams = (...stateStreams) => {
  return combineLatest(...stateStreams, (...args) =>
    args.reduce(
      (state, arg) => ({
        ...state,
        ...arg
      }),
      {}
    )
  )
}

const fromStream = stream => componentFromOps(switchMapTo(stream))

export {
  PipedComponentType,
  componentFromOps,
  handler,
  SourceType,
  streamProps,
  mapActions,
  action,
  preventDefault,
  getTargetValue,
  streamState,
  stateToStreams,
  combineStateStreams,
  fromStream,
  Stream
}
