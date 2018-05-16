import { Component, ReactNode } from "react"
import {
  Subject,
  merge,
  observable,
  Subscription,
  Observable,
  of,
  from
} from "rxjs"
import {
  scan,
  share,
  distinctUntilChanged,
  switchMap,
  map,
  tap,
  skip,
  first
} from "rxjs/operators"

class Stream extends Component<
  {
    source: Observable<any>
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
    pipe
  },
  any
> {
  newProps = plan()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  subscription: Subscription
  _isMounted = false

  constructor(props) {
    super(props)

    const props$ = merge(of(props), this.newProps)

    const state$ = props$.pipe(
      distinctUntilChanged(),
      switchMap(p => {
        console.log(`
          SWITCH
        `)
        const { source, ...props } = p as { source: Observable<any> }

        return source.pipe(map(state => ({ ...props, ...state })))
      })
    )

    this.subscription = state$.subscribe(state => {
      // this.setState(() => state)
      if (this._isMounted) {
        // console.log(`isMounted`, state, this._isMounted, this.state, this)
        this.setState(() => state)
      } else {
        // console.log(`ctor`, state, this._isMounted, this.state, this)
        this.state = state
      }
    })
  }

  componentDidMount() {
    this._isMounted = true
  }

  render() {
    if (this._isMounted) {
      // console.log(`render isMounted`, this.state, this)
    } else {
      // console.log(`render`, this.state, this)
    }
    return this.__renderFn({ ...this.state })
  }

  componentDidUpdate() {
    this.newProps(this.props)
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
