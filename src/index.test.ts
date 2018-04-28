import { expecter } from "ts-snippet"

const expectSnippet = expecter(code => `
  import { from, Observable } from "rxjs"
  import { map, mapTo } from "rxjs/operators"
  import * as p from "ts-snippet/placeholders"
  import { PipedComponentType, pipeProps, source, SourceType } from "./src/index"
  ${code}
`)

const componentType = (t: string) => `ComponentType<${t} & { children?: (props: ${t}) => ReactNode; render?: (props: ${t}) => ReactNode; }>`

const pipeArgs = (length: number) => {
  const args: string[] = []
  for (let a = 0; a < length; ++a) {
    args.push(`map((a${a}: p.T${a}) => p.c${a + 1})`)
  }
  return args.join(",")
}

describe("snippet helpers", () => {
  describe("pipeArgs", () => {
    it("should format a single mapped arg", () => {
      expect(pipeArgs(1)).toEqual("map((a0: p.T0) => p.c1)")
    })

    it("should format a single mapped arg", () => {
      expect(pipeArgs(2)).toEqual("map((a0: p.T0) => p.c1),map((a1: p.T1) => p.c2)")
    })
  })
})

describe("pipeProps", () => {
  describe("overload signatures", () => {
    it("should infer the correct types", () => {
      const snippet = expectSnippet(`
        const c0 = pipeProps<p.T0>()
        const c1 = pipeProps(${pipeArgs(1)})
        const c2 = pipeProps(${pipeArgs(2)})
        const c3 = pipeProps(${pipeArgs(3)})
        const c4 = pipeProps(${pipeArgs(4)})
        const c5 = pipeProps(${pipeArgs(5)})
        const c6 = pipeProps(${pipeArgs(6)})
        const c7 = pipeProps(${pipeArgs(7)})
        const c8 = pipeProps(${pipeArgs(8)})
        const c9 = pipeProps(${pipeArgs(9)})
        const c10 = pipeProps<p.T0, p.T10>(${pipeArgs(10)})
      `)
      snippet.toSucceed()
      snippet.toInfer("c0", componentType("T0"))
      snippet.toInfer("c1", componentType("T1"))
      snippet.toInfer("c2", componentType("T2"))
      snippet.toInfer("c3", componentType("T3"))
      snippet.toInfer("c4", componentType("T4"))
      snippet.toInfer("c5", componentType("T5"))
      snippet.toInfer("c6", componentType("T6"))
      snippet.toInfer("c7", componentType("T7"))
      snippet.toInfer("c8", componentType("T8"))
      snippet.toInfer("c9", componentType("T9"))
      snippet.toInfer("c10", componentType("T10"))
    });
  })
})

describe("source", () => {
  describe("overload signatures", () => {
    it("should infer the correct types", () => {
      const snippet = expectSnippet(`
        const s0 = source<p.T0>()
        const s1 = source(${pipeArgs(1)})
        const s2 = source(${pipeArgs(2)})
        const s3 = source(${pipeArgs(3)})
        const s4 = source(${pipeArgs(4)})
        const s5 = source(${pipeArgs(5)})
        const s6 = source(${pipeArgs(6)})
        const s7 = source(${pipeArgs(7)})
        const s8 = source(${pipeArgs(8)})
        const s9 = source(${pipeArgs(9)})
        const s10 = source<p.T0, p.T10>(${pipeArgs(10)})
      `)
      snippet.toSucceed()
      snippet.toInfer("s0", "SourceType<T0, T0>")
      snippet.toInfer("s1", "SourceType<T0, T1>")
      snippet.toInfer("s2", "SourceType<T0, T2>")
      snippet.toInfer("s3", "SourceType<T0, T3>")
      snippet.toInfer("s4", "SourceType<T0, T4>")
      snippet.toInfer("s5", "SourceType<T0, T5>")
      snippet.toInfer("s6", "SourceType<T0, T6>")
      snippet.toInfer("s7", "SourceType<T0, T7>")
      snippet.toInfer("s8", "SourceType<T0, T8>")
      snippet.toInfer("s9", "SourceType<T0, T9>")
      snippet.toInfer("s10", "SourceType<T0, T10>")
    });

    it("should be callable as a handler", () => {
      const snippet = expectSnippet(`
        const s = source(${pipeArgs(1)})
        s(p.c0)
      `)
      snippet.toSucceed()
    })

    it("should enforce the handler's type", () => {
      const snippet = expectSnippet(`
        const s = source(${pipeArgs(1)})
        s(p.c1)
      `)
      snippet.toFail(/not assignable/i)
    })

    it("should be convertible to an observable", () => {
      const snippet = expectSnippet(`
        const s = source(${pipeArgs(1)})
        const o = from(s)
      `)
      snippet.toSucceed()
      snippet.toInfer("o", "Observable<T1>")
    })
  })
})
