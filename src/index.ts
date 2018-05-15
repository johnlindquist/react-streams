import { Component, ReactNode } from "react"
import { handler } from "rx-handler"
import { merge } from "rxjs"
import { map, scan, tap } from "rxjs/operators"

class Stream extends Component<
  {
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  subscription
  cDM = handler()
  cDU = handler()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  componentDidMount() {
    console.log(`CDM`)

    const { source, ...props } = this.props
    this.mountedProps = props
    this.subscription = source.subscribe(state => {
      console.log(`setState`, state)
      this.setState(() => state)
    })
  }

  render() {
    console.log(`render`, { ...this.state, ...this.mountedProps })
    return this.subscription
      ? this.__renderFn({ ...this.state, ...this.mountedProps })
      : null
  }

  componentDidUpdate() {
    console.log(`CDU`)
    // this.cDU()
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }
}

const converge = (...streams) =>
  merge(...streams).pipe(
    scan((state = {}, value) => {
      const patch = value instanceof Function ? value(state) : value
      return { ...state, ...patch }
    })
  )

export { handler, SourceType, Stream, converge }
