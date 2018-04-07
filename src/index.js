import { createElement, Component, createContext } from "react"

import { Subject, BehaviorSubject, of } from "rxjs"

const pipeProps = (...ops) => {
  return class extends Component {
    subscription
    props$

    __renderFn = this.props.children
      ? this.props.children
      : this.props.render ? this.props.render : value => value

    componentDidMount() {
      this.props$ = new BehaviorSubject(this.props)
      this.subscription = this.props$
        .pipe(...ops)
        .subscribe(this.setState.bind(this))
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.props$.next(nextProps)
    }

    render() {
      return this.subscription ? this.__renderFn(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

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

export { pipeProps, streamProviderConsumer, sourceNext }
