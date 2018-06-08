import { Component, createElement } from "react"
import {
  combineLatest,
  concat,
  from,
  isObservable,
  merge,
  Observable,
  observable,
  of,
  OperatorFunction,
  pipe,
  Subscription,
  throwError,
  UnaryFunction
} from "rxjs"
import {
  distinctUntilChanged,
  ignoreElements,
  map,
  mergeScan,
  shareReplay,
  tap,
  withLatestFrom
} from "rxjs/operators"

export const curry = fn => (...args) =>
  args.length < fn.length ? curry(fn.bind(null, ...args)) : fn(...args)

//mergeScan's type should allow only 1 fn arg. Seed should be optional
export const patchScan: any = pipe(
  (mergeScan as any)((state = {}, update) => {
    const result = update instanceof Function ? update(state) : of(update)

    return result instanceof Observable
      ? result.pipe(map(next => ({ ...state, ...next })))
      : of({ ...state, ...result })
  })
)

export const spreadMap = (overrides = {}) =>
  map(value => ({ ...value, ...overrides }))

export const scanPlans = curry((plans, source) =>
  merge(source, ...(Object.values(plans) as any[])).pipe(
    patchScan,
    spreadMap(plans)
  )
)

export const combineSources = (...sources) =>
  combineLatest(...sources).pipe(
    map(values => values.reduce((a, c) => ({ ...a, ...c }), {}))
  )

export const isNotPlan = x => isObservable(x) && !(x instanceof Function)

export class Stream extends Component<
  {
    pipe: OperatorFunction<any, Observable<any>>
  },
  any
> {
  subscription?: Subscription
  _isMounted = false

  configureSource(props, config) {
    const { source = throwError("No source provided") } = config
      ? config
      : props
    return isNotPlan(source) ? source : from(source)
  }

  constructor(props, context, config) {
    super(props, context)

    const { source, pipe: sourcePipe, plans } = config ? config : props

    const state$ = this.configureSource(props, config).pipe(
      distinctUntilChanged(),
      plans ? scanPlans(plans) : x => x,
      sourcePipe || (x => x),
      map((state: any) => ({
        ...state,
        children:
          state.children || state.render || props.children || props.render
      }))
    )

    this.subscription = state$.subscribe(state => {
      if (this._isMounted) {
        this.setState(() => state)
      } else {
        this.state = state
      }
    })
  }

  componentDidMount() {
    this._isMounted = true
  }

  render(): any {
    return this.state ? createElement(this.state.children, this.state) : null
  }
  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe()
  }
}

export class StreamProps extends Stream {
  updateProps

  configureSource(props) {
    this.updateProps = plan()
    return concat(of(props), this.updateProps)
  }

  componentDidUpdate() {
    this.updateProps(this.props)
  }
}

export function plan(...operators) {
  let next

  const o$ = new Observable(observer => {
    next = (...arg) => {
      observer.next(...arg)
    }
  }).pipe(
    ...operators,
    shareReplay(1)
  )

  const unsubscribe = o$.subscribe()
  next["unsubscribe"] = unsubscribe
  next[observable] = () => o$
  return next
}

export const fromPlan = (otherPlan, selector): UnaryFunction<any, any> =>
  pipe(
    withLatestFrom(otherPlan, (_, value) => value),
    map(selector)
  )
export const toPlan = (otherPlan, selector = x => x): UnaryFunction<any, any> =>
  pipe(
    map(selector),
    tap(otherPlan),
    ignoreElements()
  )

export const stream = (source, pipe, plans) => (props, context) =>
  new Stream(props, context, { source, pipe, plans })

export const streamProps = (pipe, plans) => (props, context) =>
  new StreamProps(props, context, { pipe, plans })
