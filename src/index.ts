import { Component, ReactNode } from "react"
import {
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
  UnaryFunction,
  concat,
  from,
  isObservable,
  merge,
  observable,
  of,
  pipe,
  throwError
} from "rxjs"
import {
  distinctUntilChanged,
  ignoreElements,
  map,
  mergeScan,
  share,
  tap,
  withLatestFrom
} from "rxjs/operators"

const curry = fn => (...args) =>
  args.length < fn.length ? curry(fn.bind(null, ...args)) : fn(...args)

//mergeScan's type should allow only 1 fn arg. Seed should be optional
const patchScan: any = pipe(
  (mergeScan as any)((state = {}, update) => {
    const result = update instanceof Function ? update(state) : of(update)

    return result instanceof Observable
      ? result.pipe(map(next => ({ ...state, ...next })))
      : of({ ...state, ...result })
  })
)

const spreadMap = (overrides = {}) => map(value => ({ ...value, ...overrides }))

const mergePlans = curry((plans, source) =>
  merge(source, ...(Object.values(plans) as any[])).pipe(
    patchScan,
    spreadMap(plans)
  )
)

const mergeSources = (...streams) => merge(...streams).pipe(patchScan)

const isNotPlan = x => isObservable(x) && !(x instanceof Function)

class Stream extends Component<
  {
    pipe: OperatorFunction<any, Observable<any>>
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  _renderFn = (this.props.children ||
    this.props.render ||
    ((state: any) => {
      throw Error("Need children or render")
    })) as Function

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
      plans ? mergePlans(plans) : x => x,
      sourcePipe || (x => x)
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

  render() {
    return this.state ? this._renderFn(this.state) : null
  }
  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe()
  }
}

class StreamProps extends Stream {
  updateProps

  configureSource(props) {
    this.updateProps = plan()
    return concat(of(props), this.updateProps)
  }

  componentDidUpdate() {
    this.updateProps(this.props)
  }
}

function plan(...operators) {
  const subject = new Subject()
  const source = subject.pipe(...operators, share())

  const next = (...args) => subject.next(...args)
  next[observable] = () => source
  return next
}

const fromPlan = (otherPlan, selector): UnaryFunction<any, any> =>
  pipe(withLatestFrom(otherPlan, (_, value) => value), map(selector))
const toPlan = (otherPlan, selector = x => x): UnaryFunction<any, any> =>
  pipe(map(selector), tap(otherPlan), ignoreElements())

const stream = (source, pipe, plans) => (props, context) =>
  new Stream(props, context, { source, pipe, plans })

const streamProps = (pipe, plans) => (props, context) =>
  new StreamProps(props, context, { pipe, plans })

export {
  plan,
  fromPlan,
  toPlan,
  Stream,
  StreamProps,
  stream,
  streamProps,
  mergePlans,
  mergeSources
}
