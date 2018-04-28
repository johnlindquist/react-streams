import { Component, ReactNode } from "react"

import {
  Observable,
  ObservableInput,
  observable,
  OperatorFunction,
  Subject
} from "rxjs"
import {
  distinctUntilChanged,
  startWith,
  switchMap
} from "rxjs/operators"

type PipedComponentType<T> = React.ComponentType<
  T & {
    children?: (props: T) => React.ReactNode
    render?: (props: T) => React.ReactNode
  }
>

function pipeProps<T>(): PipedComponentType<T>
function pipeProps<T, A>(
  op1: OperatorFunction<T, A>
): PipedComponentType<A>
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
  return class extends Component<
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
        .pipe(
          startWith(this.props),
          distinctUntilChanged(),
          ...operations
        )
        .subscribe(this.setState.bind(this))
    }

    render() {
      return this.subscription
        ? this.__renderFn(this.state)
        : null
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

function source<T>(): SourceType<T, T>
function source<T, A>(
  op1: OperatorFunction<T, A>
): SourceType<T, A>
function source<T, A, B>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>
): SourceType<T, B>
function source<T, A, B, C>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>
): SourceType<T, C>
function source<T, A, B, C, D>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>
): SourceType<T, D>
function source<T, A, B, C, D, E>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>
): SourceType<T, E>
function source<T, A, B, C, D, E, F>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>
): SourceType<T, F>
function source<T, A, B, C, D, E, F, G>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>
): SourceType<T, G>
function source<T, A, B, C, D, E, F, G, H>(
  op1: OperatorFunction<T, A>,
  op2: OperatorFunction<A, B>,
  op3: OperatorFunction<B, C>,
  op4: OperatorFunction<C, D>,
  op5: OperatorFunction<D, E>,
  op6: OperatorFunction<E, F>,
  op7: OperatorFunction<F, G>,
  op8: OperatorFunction<G, H>
): SourceType<T, H>
function source<T, A, B, C, D, E, F, G, H, I>(
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
function source<T, R>(
  ...operations: OperatorFunction<any, any>[]
): SourceType<T, R>
function source<T>(...operations) {
  const subject = new Subject<T>()
  const source = subject.pipe(...operations)

  const handler = (...args) => subject.next(...args)
  handler[observable] = () => source
  return handler
}

export { PipedComponentType, pipeProps, source, SourceType }
