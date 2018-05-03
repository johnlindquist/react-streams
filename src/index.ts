import { Component, ReactNode } from "react"

import {
  Observable,
  ObservableInput,
  observable,
  OperatorFunction,
  Subject,
  combineLatest,
  concat,
  merge,
  from,
  of,
  MonoTypeOperatorFunction
} from "rxjs"
import {
  distinctUntilChanged,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
  mergeMap,
  map,
  scan,
  pluck
} from "rxjs/operators"
import { MapOperator } from "rxjs/internal/operators/map"

type PipedComponentType<T> = React.ComponentType<
  T & {
    children?: (props: T) => React.ReactNode
    render?: (props: T) => React.ReactNode
  }
>

function pipeProps<T>(): PipedComponentType<T>
function pipeProps<T, A>(op1: OperatorFunction<T, A>): PipedComponentType<A>
function pipeProps<T, A, B>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>
): PipedComponentType<B>
function pipeProps<T, A, B, C>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>
): PipedComponentType<C>
function pipeProps<T, A, B, C, D>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): PipedComponentType<D>
function pipeProps<T, A, B, C, D, E>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): PipedComponentType<E>
function pipeProps<T, A, B, C, D, E, F>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): PipedComponentType<F>
function pipeProps<T, A, B, C, D, E, F, G>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): PipedComponentType<G>
function pipeProps<T, A, B, C, D, E, F, G, H>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): PipedComponentType<H>
function pipeProps<T, A, B, C, D, E, F, G, H, I>(
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
function pipeProps<T, R>(
  ...operations: OperatorFunction<any, any>[]
): PipedComponentType<R>
function pipeProps<T>(...operations) {
  return class PipeProps extends Component<
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
      this.subscription = this.setState$
        .pipe(startWith(this.props), distinctUntilChanged(), ...operations)
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
}

//TODO: optimize :)
const propsToStreams = fn =>
  //maybe we need a "switchProps", "mergeProps", "concatProps", etc...
  //but I can't think of many scenarios where props update and you wouldn't want to "switch"
  switchMap(inProps => {
    const props = fn(inProps)
    //re-creating Object.entries()
    const entries = Object.keys(props).map(key => [key, props[key]])

    return entries.length === 0 ? of({}) :
      combineLatest(entries.map(([_, v]) => v instanceof Observable ? v : of(v))).pipe(
        map(values => values.reduce(
          (acc, value, index) => ({ ...acc, [entries[index][0]]: value }),
          {}
        ))
      )
  })

function streamProps<T>(fn) {
  return class PipeProps extends Component<
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
      this.subscription = this.setState$
        .pipe(startWith(this.props), distinctUntilChanged(), propsToStreams(fn))
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
}
type SourceType<T, R> = ((value: T) => void) & ObservableInput<R>

function handler<T>(): SourceType<T, T>
function handler<T, A>(op1: OperatorFunction<T, A>): SourceType<T, A>
function handler<T, A, B>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>
): SourceType<T, B>
function handler<T, A, B, C>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>
): SourceType<T, C>
function handler<T, A, B, C, D>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): SourceType<T, D>
function handler<T, A, B, C, D, E>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): SourceType<T, E>
function handler<T, A, B, C, D, E, F>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): SourceType<T, F>
function handler<T, A, B, C, D, E, F, G>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): SourceType<T, G>
function handler<T, A, B, C, D, E, F, G, H>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): SourceType<T, H>
function handler<T, A, B, C, D, E, F, G, H, I>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>,
  op9: OperatorFunction<H, I>
): SourceType<T, I>
function handler<T, R>(
  ...operations: OperatorFunction<any, any>[]
): SourceType<T, R>
function handler<T>(...operations) {
  const subject = new Subject<T>()
  const source = subject.pipe(...operations)

  const next = (...args) => subject.next(...args)
  next[observable] = () => source
  return next
}

const streamActions = (stream, actions) =>
  concat(stream, merge(...actions)).pipe(
    scan((value, fn: Function) => fn(value))
  )

const action = (src, reducer) => from(src).pipe(map(reducer))

const preventDefault: MonoTypeOperatorFunction<Event> = tap((e: Event) =>
  e.preventDefault()
)
const getTargetValue = pluck("target", "value")

export {
  PipedComponentType,
  pipeProps,
  handler,
  SourceType,
  streamProps,
  propsToStreams,
  streamActions,
  action,
  preventDefault,
  getTargetValue
}
