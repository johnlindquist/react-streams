import { Component, ReactNode } from "react"
import { Subject, merge, observable, Subscription, Observable } from "rxjs"
import {
  scan,
  share,
  distinctUntilChanged,
  switchMap,
  map,
  tap
} from "rxjs/operators"

class Stream extends Component<
  {
    source: Observable<any>
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  componentDidMountPlan = plan()
  componentDidUpdatePlan = plan()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  subscription: Subscription = merge(
    this.componentDidMountPlan,
    this.componentDidUpdatePlan
  )
    .pipe(
      distinctUntilChanged(),
      switchMap(p => {
        const { source, ...props } = p as { source: Observable<any> }

        return source.pipe(map(state => ({ ...state, ...props })))
      })
    )
    .subscribe(state => {
      this.setState(() => state)
    })

  componentDidMount() {
    this.componentDidMountPlan(this.props)
  }

  render() {
    return this.state ? this.__renderFn({ ...this.state }) : null
  }

  componentDidUpdate() {
    this.componentDidUpdatePlan(this.props)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

const converge: any = (...streams) =>
  merge(...streams).pipe(
    scan((state = {}, value) => {
      const patch = value instanceof Function ? value(state) : value
      return { ...state, ...patch }
    })
  )
function plan(...operators) {
  const subject = new Subject()
  const source = subject.pipe(...operators, share())

  const next = (...args) => subject.next(...args)
  next[observable] = () => source
  return next
}

export { plan, Stream, converge }
