import { createElement, Component, createContext } from "react"

import { Subject, BehaviorSubject } from "rxjs"
import { map } from "rxjs/operators"

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

const streamPropsToRender = streamFn => mapStreamToState(RENDER)(streamFn)

const streamPropsToChildren = streamFn => mapStreamToState(CHILDREN)(streamFn)

const streamPropsToComponent = streamFn => mapStreamToState(VDOM$)(streamFn)

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

const subjectHandlerPair = (...args) => {
  const subject = new Subject()

  return [subject.pipe(...args), subject.next.bind(subject)]
}

export {
  streamPropsToRender,
  streamPropsToChildren,
  streamPropsToComponent,
  streamProviderConsumer,
  subjectHandlerPair
}
