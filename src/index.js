import { createElement, Component, createContext } from "react"

import { Subject } from "rxjs"
import { startWith, switchMap, distinctUntilChanged } from "rxjs/operators"

const pipeProps = (...operations) => {
  return class extends Component {
    setState$ = new Subject()
    subscription
    state = {}

    __renderFn = this.props.children
      ? this.props.children
      : this.props.render ? this.props.render : value => value

    componentDidMount() {
      this.subscription = this.setState$
        .pipe(startWith(this.props), distinctUntilChanged(), ...operations)
        .subscribe(this.setState.bind(this))
    }

    componentDidUpdate() {
      this.setState$.next(this.props)
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
        optionalValue !== undefined
          ? observableOrFn instanceof Function
            ? observableOrFn(optionalValue)
            : observableOrFn.pipe(startWith(optionalValue))
          : observableOrFn
      return observable
    }),
    ...operations
  )

const streamProviderConsumer = stream$ => {
  const { Provider, Consumer } = createContext()

  class StreamProvider extends Component {
    subscription
    componentDidMount() {
      this.subscription = stream$.subscribe(this.setState.bind(this))
    }

    render() {
      return this.state
        ? createElement(Provider, { value: this.state }, this.props.children)
        : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }

  return [StreamProvider, Consumer]
}

const sourceNext = (...args) => {
  const subject = new Subject()

  return [subject.pipe(...args), subject.next.bind(subject)]
}

export { pipeProps, switchProps, streamProviderConsumer, sourceNext }
