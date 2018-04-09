import { Component } from "react"

import { Subject } from "rxjs"
import { startWith, distinctUntilChanged } from "rxjs/operators"

const pipeProps = (...operations) => {
  return class extends Component {
    setState$ = new Subject()
    subscription

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

const sourceNext = (...args) => {
  const subject = new Subject()

  return [subject.pipe(...args), subject.next.bind(subject)]
}

export { pipeProps, sourceNext }
