import { Component, ReactNode } from "react"
import {
  Observable,
  Subject,
  Subscription,
  concat,
  merge,
  observable,
  of
} from "rxjs"
import {
  distinctUntilChanged,
  map,
  scan,
  share,
  switchMap
} from "rxjs/operators"

const defaultReceiveProps = switchMap(p => {
  const { source, ...props } = p as { source: Observable<any> }

  return source.pipe(map(state => ({ ...props, ...state })))
})

class Stream extends Component<
  {
    source: Observable<any>
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
    pipe
  },
  any
> {
  updateProps = plan()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  subscription: Subscription
  _isMounted = false

  constructor(props) {
    super(props)

    const props$ = concat(of(props), this.updateProps)

    const state$ = props$.pipe(
      distinctUntilChanged(),
      props.receiveProps ? props.receiveProps : defaultReceiveProps
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
    return this.__renderFn({ ...this.state })
  }

  componentDidUpdate() {
    this.updateProps(this.props)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

const patchScan = scan((state = {}, applyPatch) => {
  const patch = applyPatch instanceof Function ? applyPatch(state) : applyPatch
  return { ...state, ...patch }
})

const converge: any = (...streams) => merge(...streams).pipe(patchScan)
function plan(...operators) {
  const subject = new Subject()
  const source = subject.pipe(...operators, share())

  const next = (...args) => subject.next(...args)
  next[observable] = () => source
  return next
}

export { plan, Stream, converge }
