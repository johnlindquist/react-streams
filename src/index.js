import * as React from "react"
import { Component, createContext } from "react"

import { Subject, BehaviorSubject, of } from "rxjs"
import { startWith, map, tap } from "rxjs/operators"

const RENDER = "__RENDER"
const CHILDREN = "__CHILDREN"
const VDOM$ = "__VDOM$"

const mapStreamToState = target => streamFn => {
  return class extends Component {
    props$ = new BehaviorSubject(this.props)
    stream$ = streamFn(this.props$).pipe(
      map(props => (target === VDOM$ ? { vdom$: props } : props))
    )

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.props$.next(nextProps)
    }

    subscription

    __renderFn = {
      [RENDER]: value => this.props.render(value),
      [CHILDREN]: value => this.props.children(value),
      [VDOM$]: value => this.state.vdom$
    }[target]

    componentDidMount() {
      this.subscription = this.stream$.subscribe(this.setState.bind(this))
    }

    render() {
      return this.subscription ? this.__renderFn(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

const streamRender = streamFn => mapStreamToState(RENDER)(streamFn)

const streamChildren = streamFn => mapStreamToState(CHILDREN)(streamFn)

const streamComponent = streamFn => mapStreamToState(VDOM$)(streamFn)

const streamContext = stream => {
  const { Provider, Consumer } = createContext()

  class StreamProvider extends Component {
    subscription
    componentWillMount() {
      this.subscription = stream.subscribe(this.setState.bind(this))
    }

    render() {
      return this.state ? (
        <Provider {...this.state}>{this.props.children}</Provider>
      ) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }

  return [StreamProvider, Consumer]
}

const streamHandler = (...args) => {
  const subject = new Subject()

  return [subject.pipe(...args), subject.next.bind(subject)]
}

const streamHandlerStartWith = (value, ...args) =>
  streamHandler(startWith(value), ...args)

export {
  streamRender,
  streamChildren,
  streamComponent,
  streamContext,
  streamHandler,
  streamHandlerStartWith
}
