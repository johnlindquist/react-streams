import { Stream } from "./stream"
import { plan } from "./plan"
import { concat, of } from "rxjs"

export class StreamProps extends Stream {
  updateProps

  configureSource(props) {
    this.updateProps = plan()
    return concat(of(props), this.updateProps)
  }

  componentDidUpdate() {
    this.updateProps(this.props)
  }
}

export const streamProps = (pipe, plans) => (props, context) =>
  new StreamProps(props, context, { pipe, plans })
