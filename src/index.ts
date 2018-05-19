import { Component, ReactNode } from "react"
import {
  Observable,
  Subject,
  Subscription,
  concat,
  merge,
  observable,
  of,
  OperatorFunction,
  isObservable,
  pipe,
  UnaryFunction,
  from
} from "rxjs"
import {
  distinctUntilChanged,
  map,
  scan,
  share,
  switchMap,
  tap,
  withLatestFrom,
  ignoreElements
} from "rxjs/operators"

const patchScan = scan((state = {}, update) => {
  const patch = update instanceof Function ? update(state) : update
  return { ...state, ...patch }
})

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

const converge = (plans, ...streams) =>
  switchMap(({ pipe, ...props }) => {
    return concat(
      of(props),
      merge(...(Object.values(plans) as any[]), ...streams)
    ).pipe(patchScan, spreadMap(plans))
  })

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
  plans: any = {}
  _isMounted = false

  setup(props, context, config) {
    this.plans = config.plans

    return concat(of(props), this.updateProps).pipe(
      distinctUntilChanged(),
      props.pipe || config.pipe || (x => x)
    )
  }

  constructor(props, context, config: any = {}) {
    super(props, context)

    const state$ = this.setup(props, context, config)

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
    return this.state ? this._renderFn(this.state, this.plans) : null
  }

  componentDidUpdate() {
    this.updateProps(this.props)
  }

  componentWillUnmount() {
    if (this.subscription) this.subscription.unsubscribe()
  }
}

class Subscribe extends Stream {
  setup(props, context, config) {
    this.plans = { ...props.plans, ...config.plans }

    const pickSource = props.source || config.source

    if (!pickSource) throw Error("'subscribe' requires a source")

    const state$ =
      pickSource instanceof Observable ? pickSource : from(pickSource)
    return state$.pipe(
      distinctUntilChanged(),
      props.pipe || config.pipe || (x => x)
    )
  }
}

const stream = (pipe, plans) => (props, context) =>
  new Stream(props, context, { pipe, plans })

const subscribe = (source, pipe, plans) => (props, context) =>
  new Subscribe(props, context, { source, pipe, plans })

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

export {
  plan,
  fromPlan,
  toPlan,
  Stream,
  Subscribe,
  stream,
  subscribe,
  converge,
  assign
}
