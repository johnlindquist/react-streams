import { createElement, Component, createContext } from "react"

import { Subject } from "rxjs"
import { startWith, switchMap } from "rxjs/operators"

const pipeProps = (...operations) => {
  const setState$ = new Subject()

  return class extends Component {
    subscription
    state = {}

    __renderFn = this.props.children
      ? this.props.children
      : this.props.render ? this.props.render : value => value

    componentDidMount() {
      this.subscription = setState$
        .pipe(startWith(this.props), ...operations)
        .subscribe(this.setState.bind(this))
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
      setState$.next(nextProps)
      return nextProps
    }

    render() {
      return this.subscription ? this.__renderFn(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

const switchProps = (observable, selectOrValue) => (...operations) =>
  pipeProps(
    switchMap(props => {
      const value =
        selectOrValue instanceof Function ? selectOrValue(props) : selectOrValue
      return value ? observable.pipe(startWith(value)) : observable
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
