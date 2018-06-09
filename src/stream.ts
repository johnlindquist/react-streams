import { Component, createElement } from "react"
import {
  concat,
  from,
  Observable,
  of,
  OperatorFunction,
  Subscription,
  throwError
} from "rxjs"
import { distinctUntilChanged, map, tap } from "rxjs/operators"
import { isNotPlan } from "./utils/isNotPlan"
import { scanPlans } from "./observable/scanPlans"
import { plan } from "./plan"

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

    const { pipe: sourcePipe, plans } = config ? config : props

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

export const stream = (source, pipe, plans) => (props, context) =>
  new Stream(props, context, { source, pipe, plans })

export const streamProps = (pipe, plans) => (props, context) =>
  new StreamProps(props, context, { pipe, plans })
