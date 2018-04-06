import { createElement, Component, createContext } from "react"

import { Subject, BehaviorSubject, of } from "rxjs"
import { map, tap } from "rxjs/operators"

const RENDER = "__RENDER"
const CHILDREN = "__CHILDREN"
const VDOM$ = "__VDOM$"

const operatorsToRender = target => (...ops) => {
  return class extends Component {
    subscription
    props$

    __renderFn = {
      [RENDER]: value => this.props.render(value),
      [CHILDREN]: value => this.props.children(value),
      [VDOM$]: value => this.state.vdom$
    }[target]

    componentDidMount() {
      this.props$ = new BehaviorSubject(this.props)
      this.subscription = this.props$
        .pipe(
          ...ops,
          map(value => (target === VDOM$ ? { vdom$: value } : value))
        )
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

const pipePropsToRender = (...ops) => operatorsToRender(RENDER)(...ops)

const pipePropsToChildren = (...ops) => operatorsToRender(CHILDREN)(...ops)

const pipePropsToComponent = (...ops) => operatorsToRender(VDOM$)(...ops)

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
  pipePropsToRender,
  pipePropsToChildren,
  pipePropsToComponent,
  streamToProviderConsumer,
  subjectHandlerPair
}
