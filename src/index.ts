import * as React from "react"

import { Observable, OperatorFunction, Subject } from "rxjs"
import { startWith, switchMap } from "rxjs/operators"

type PipedComponentType<T> = React.ComponentType<T & {
  children?: (props: T) => React.ReactNode;
  render?: (props: T) => React.ReactNode;
}>

function pipeProps<T>(): PipedComponentType<T>;
function pipeProps<T, A>(op1: OperatorFunction<T, A>): PipedComponentType<A>;
function pipeProps<T, A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): PipedComponentType<B>;
function pipeProps<T, A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): PipedComponentType<C>;
function pipeProps<T, A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): PipedComponentType<D>;
function pipeProps<T, A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): PipedComponentType<E>;
function pipeProps<T, A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): PipedComponentType<F>;
function pipeProps<T, A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): PipedComponentType<G>;
function pipeProps<T, A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): PipedComponentType<H>;
function pipeProps<T, A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): PipedComponentType<I>;
function pipeProps<T, R>(...operations: OperatorFunction<any, any>[]): PipedComponentType<R>;
function pipeProps<T>(...operations) {
  const setState$ = new Subject<T>()

  return class extends React.Component<{
    children?: (props: any) => React.ReactNode;
    render?: (props: any) => React.ReactNode;
  }, any> {
    subscription
    state = {}

    __renderFn = (this.props.children
      ? this.props.children
      : this.props.render ? this.props.render : value => value) as Function

    componentDidMount() {
      this.subscription = setState$
        .pipe(startWith(this.props), ...operations)
        .subscribe(this.setState.bind(this))
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
      setState$.next(nextProps)
      return null
    }

    render() {
      return this.subscription ? this.__renderFn(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}
/*
Covering cases:
(input$, "text") //switch to stream, startWith second param
(ajax("http://")) //switch to stream, no startWith
(ajax, ({url}) => url) //switch to creation fn, create with url from props
*/
const switchProps = (observableOrFn, optionalSelectOrValue) => (
  ...operations
) =>
  pipeProps(
    switchMap(props => {
      const optionalValue =
        optionalSelectOrValue instanceof Function
          ? optionalSelectOrValue(props)
          : optionalSelectOrValue

      const observable =
        observableOrFn instanceof Function
          ? optionalValue
            ? observableOrFn(optionalValue)
            : observableOrFn.pipe(startWith(optionalValue))
          : observableOrFn
      return observable
    }),
    ...operations
  )

const streamProviderConsumer = stream$ => {
  const createContext = (React as any).createContext;
  const { Provider, Consumer } = createContext()

  class StreamProvider extends React.Component {
    subscription
    componentDidMount() {
      this.subscription = stream$.subscribe(this.setState.bind(this))
    }

    render() {
      return this.state
        ? React.createElement(Provider, { value: this.state }, this.props.children)
        : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }

  return [StreamProvider, Consumer]
}

function sourceNext<T>(): [Observable<T>, (value: T) => {}];
function sourceNext<T, A>(op1: OperatorFunction<T, A>): [Observable<A>, (value: T) => {}];
function sourceNext<T, A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): [Observable<B>, (value: T) => {}];
function sourceNext<T, A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): [Observable<C>, (value: T) => {}];
function sourceNext<T, A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): [Observable<D>, (value: T) => {}];
function sourceNext<T, A, B, C, D, E>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): [Observable<E>, (value: T) => {}];
function sourceNext<T, A, B, C, D, E, F>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>): [Observable<F>, (value: T) => {}];
function sourceNext<T, A, B, C, D, E, F, G>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>): [Observable<G>, (value: T) => {}];
function sourceNext<T, A, B, C, D, E, F, G, H>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>): [Observable<H>, (value: T) => {}];
function sourceNext<T, A, B, C, D, E, F, G, H, I>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>, op6: OperatorFunction<E, F>, op7: OperatorFunction<F, G>, op8: OperatorFunction<G, H>, op9: OperatorFunction<H, I>): [Observable<I>, (value: T) => {}];
function sourceNext<T, R>(...operations: OperatorFunction<T, R>[]): [Observable<R>, (value: T) => {}];
function sourceNext<T>(...operations) {
  const subject = new Subject<T>()

  return [subject.pipe(...operations), subject.next.bind(subject)]
}

export { PipedComponentType, pipeProps, switchProps, streamProviderConsumer, sourceNext }
