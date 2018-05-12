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
    const { state, handlers, map, pipe, ...props } = this.props
    this.handlers = handlers
    const flatState = { ...state, ...props }
    let ops = [startWith(flatState), distinctUntilChanged()]

    if (handlers) {
      ops = [
        ...ops,
        switchMap(state => {
          return concat(of(state), merge(...Object.values(this.handlers))).pipe(
            scan((acc, fn) => fn(acc))
          )
        })
      ]
    }

    if (pipe) {
      ops = [...ops, ...pipe]
    }

    if (map) {
      ops = [...ops, switchMapPropsToObjectOfStreams(map)]
    }

    this.subscription = this.setState$
      .pipe(...ops)
      .subscribe(state => this.setState(() => state))
  }

  render() {
    console.log(`render`, this.state, this.handlers)
    return this.subscription ? this.__renderFn(this.state, this.handlers) : null
  }

  shouldComponentUpdate(nextProps) {
    return !this.state || nextProps !== this.props
  }

  componentDidUpdate() {
    const { state, handlers, map, pipe, ...props } = this.props
    this.handlers = handlers
    const flatState = { ...state, ...props }
    this.setState$.next(flatState)
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

type PipedComponentType<T> = React.ComponentType<
  T & {
    children?: (props: T) => React.ReactNode
    render?: (props: T) => React.ReactNode
  }
>

function componentFromOps<T>(): PipedComponentType<T>
function componentFromOps<T, A>(
  op1: OperatorFunction<T, A>
): PipedComponentType<A>
function componentFromOps<T, A, B>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>
): PipedComponentType<B>
function componentFromOps<T, A, B, C>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>
): PipedComponentType<C>
function componentFromOps<T, A, B, C, D>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): PipedComponentType<D>
function componentFromOps<T, A, B, C, D, E>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): PipedComponentType<E>
function componentFromOps<T, A, B, C, D, E, F>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): PipedComponentType<F>
function componentFromOps<T, A, B, C, D, E, F, G>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): PipedComponentType<G>
function componentFromOps<T, A, B, C, D, E, F, G, H>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): PipedComponentType<H>
function componentFromOps<T, A, B, C, D, E, F, G, H, I>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>
): PipedComponentType<I>
function componentFromOps<T, R>(
  ...operations: OperatorFunction<any, any>[]
): PipedComponentType<R>
function componentFromOps<T>(...operations) {
  return props => {
    class StreamComponent extends Component<
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
        const foo = { ...this.props, ...props }
        console.log({ foo })
        this.subscription = this.setState$
          .pipe(startWith(foo), distinctUntilChanged(), ...props.ops)
          .subscribe(this.setState.bind(this))
      }

      render() {
        return this.subscription ? this.__renderFn(this.state) : null
      }

      componentDidUpdate() {
        this.setState$.next(this.props)
      }

      componentWillUnmount() {
        this.subscription.unsubscribe()
      }
    }

    if (props.children) {
      return new StreamComponent(props)
    } else {
      return StreamComponent
    }
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
