import * as React from "react"
import { Component } from "react"

import { Subject } from "rxjs"

const streamRender = propsToStream => {
  return class extends Component {
    subscription
    componentWillMount() {
      this.subscription = propsToStream(this.props).subscribe(
        this.setState.bind(this)
      )
    }

    render() {
      return this.state ? (this.props as any).render(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

const streamChild = propsToStream => {
  return class extends Component {
    subscription
    componentWillMount() {
      this.subscription = propsToStream(this.props).subscribe(
        this.setState.bind(this)
      )
    }

    render() {
      return this.state ? (this.props as any).children(this.state) : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

const streamComponent = propsToStream => {
  return class extends Component {
    subscription
    componentWillMount() {
      this.subscription = propsToStream(this.props).subscribe(vdom$ => {
        this.setState.call(this, { vdom$ })
      })
    }

    render() {
      console.log(this.state)
      return this.state ? this.state.vdom$ : null
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }
  }
}

const bindHandler = (...args) => {
  const subject = new Subject()

  return [subject.pipe(...args), subject.next.bind(subject)]
}

export { streamRender, streamChild, streamComponent, bindHandler }
