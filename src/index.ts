import { Component, ReactNode } from "react"
import { handler } from "rx-handler"
import { merge } from "rxjs"
import { map, scan, tap } from "rxjs/operators"

const config = (source, m = {}) => {
  console.log(`
  ---config---
  `)
  const state$ = source.pipe(map(state => state))
  return merge(state$, ...Object.values(m)).pipe(
    tap(v => console.log(`merge`, v)),
    scan((state, fnOrObj) => {
      if (!state) return fnOrObj()
      if (fnOrObj instanceof Function) {
        return { ...state, ...fnOrObj(state) }
      } else {
        return { ...state, ...fnOrObj }
      }
    })
  )
}

class Stream extends Component<
  {
    children?: (props: any) => ReactNode
    render?: (props: any) => ReactNode
  },
  any
> {
  subscription
  merge
  cDU = handler()

  __renderFn = (this.props.children
    ? this.props.children
    : this.props.render
      ? this.props.render
      : value => value) as Function

  componentDidMount() {
    console.log(`CDM`)
    this.merge = this.props.merge

    this.subscription = config(this.props.source, this.props.merge).subscribe(
      state => {
        console.log(`setState`, state)
        this.setState(() => state)
      }
    )
  }

  // shouldComponentUpdate(nextProps) {
  //   return this.props != nextProps
  // }

  render() {
    const { source, merge, ...props } = this.props
    console.log(`render`, { source, merge, props })
    return this.subscription && this.state
      ? this.__renderFn({ ...this.state, ...this.merge, ...props })
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

export { handler, SourceType, Stream, config }
