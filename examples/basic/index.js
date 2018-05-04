import { delay, startWith } from "rxjs/operators"
import { pipeProps } from "../../"

const Message = pipeProps(delay(2000), startWith({ message: "Wait..." }))

export default () => (
  <Message message="Hello">{({ message }) => <div>{message}</div>}</Message>
)
