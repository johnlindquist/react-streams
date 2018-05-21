import { Component, ReactNode } from "react"
import {
  Observable,
  OperatorFunction,
  Subject,
  Subscription,
  UnaryFunction,
  concat,
  merge,
  observable,
  of,
  pipe
} from "rxjs"
import {
  distinctUntilChanged,
  ignoreElements,
  map,
  scan,
  share,
  tap,
  withLatestFrom,
  switchAll,
  mergeScan
} from "rxjs/operators"

const curry = fn => (...args) =>
  args.length < fn.length ? curry(fn.bind(null, ...args)) : fn(...args)

// const patch = update instanceof Function ? update(state) : update
// return { ...state, ...patch }
const patchScan: any = pipe(
  (mergeScan as any)((state = {}, update) => {
    console.log
    const result = update instanceof Function ? update(state) : of(update)

    return result instanceof Observable
      ? result.pipe(map(v => ({ ...state, ...v })))
      : of({ ...state, ...result })
  })
)

const filterObject = (o, fn) =>
  Object.entries(o)
    .filter(fn)
    .reduce(
      (o, [key, value]) => ({
        ...o,
        [key]: value
      }),
      {}
    )

const update = key => map(key => () => ({ key }))
const spreadMap = (overrides = {}) => map(value => ({ ...value, ...overrides }))

const mergePlans = curry((plans, source) =>
  merge(...(Object.values(plans) as any[]), source).pipe(
    patchScan,
    spreadMap(plans)
  )
)

const assign = (...streams) => merge(...streams).pipe(patchScan)

class Stream extends Component<
  {
    pipe: OperatorFunction<any, Observable<any>>
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  updateProps = plan()

  _renderFn = (this.props.children ||
    this.props.render ||
    ((state: any) => {
      throw Error("Need children or render")
    })) as Function

  subscription?: Subscription
  _isMounted = false

  constructor(props, context) {
    super(props.props || props, context)

    const source = props.source
      ? props.source
      : concat(of(props.props || props), this.updateProps)

    const state$ = source.pipe(
      distinctUntilChanged(),
      mergePlans(props.plans || {}),
      props.pipe || (x => x)
    )

    this.subscription = state$.subscribe(state => {
      if (state.children) this._renderFn = state.children
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
  componentDidUpdate() {
    this.updateProps(this.props)
  }
  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe()
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

const stream = pipe => (props, context) => new Stream({ pipe, props }, context)

export { plan, fromPlan, toPlan, Stream, stream, mergePlans, assign }
