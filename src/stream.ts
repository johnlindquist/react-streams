import { Component, createElement } from "react"
import {
  from,
  Observable,
  OperatorFunction,
  Subscription,
  throwError
} from "rxjs"
import {
  distinctUntilChanged,
  map
} from "rxjs/operators"

export class Stream extends Component<
  {
    pipe: OperatorFunction<any, Observable<any>>
  },
  any
> {
  subscription?: Subscription
  _isMounted = false

  configureSource(props, config) {
    const {
      source = throwError("No source provided")
    } = config ? config : props
    return from(source)
  }

  constructor(props, context, config) {
    super(props, context)

    const { pipe: sourcePipe } = config ? config : props

    const state$ = this.configureSource(
      props,
      config
    ).pipe(
      distinctUntilChanged(),
      sourcePipe || (x => x),
      map((state: any) => ({
        ...state,
        children:
          state.children ||
          state.render ||
          props.children ||
          props.render
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
    return this.state
      ? createElement(this.state.children, this.state)
      : null
  }
  componentWillUnmount() {
    if (this.subscription)
      this.subscription.unsubscribe()
  }
}

export const stream = (source, pipe) => (
  props,
  context
) => new Stream(props, context, { source, pipe })
