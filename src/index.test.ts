import { expecter } from "ts-snippet"

const expectSnippet = expecter(code => `
    import { from, Observable } from "rxjs"
    import { mapTo } from "rxjs/operators"
    import * as p from "ts-snippet/placeholders"
    import { PipedComponentType, pipeProps, source, SourceType } from "./src/index"
    ${code}
`)

// Note that in the overload signature tests, the type parameters for the first
// pipeable operator have to be specified explicitly, as 'source' is not a
// method that's called on an observable. And if only one type parameter is
// specified, the remaining type parameters are inferred to be {}.

describe("pipeProps", () => {
    describe("overload signatures", () => {
        it("should infer the correct types", () => {
            const componentType = t => `ComponentType<${t} & { children?: (props: ${t}) => ReactNode; render?: (props: ${t}) => ReactNode; }>`
            const expect = expectSnippet(`
                const m = mapTo
                const m1 = m<p.T0, p.T1>(p.c1)
                const c0 = pipeProps<p.T0>()
                const c1 = pipeProps(m1)
                const c2 = pipeProps(m1, m(p.c2))
                const c3 = pipeProps(m1, m(p.c2), m(p.c3))
                const c4 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4))
                const c5 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5))
                const c6 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6))
                const c7 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7))
                const c8 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8))
                const c9 = pipeProps(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8), m(p.c9))
                const c10 = pipeProps<p.T0, p.T10>(m(p.c1), m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8), m(p.c9), m(p.c10))
            `)
            expect.toSucceed()
            expect.toInfer("c0", componentType("T0"))
            expect.toInfer("c1", componentType("T1"))
            expect.toInfer("c2", componentType("T2"))
            expect.toInfer("c3", componentType("T3"))
            expect.toInfer("c4", componentType("T4"))
            expect.toInfer("c5", componentType("T5"))
            expect.toInfer("c6", componentType("T6"))
            expect.toInfer("c7", componentType("T7"))
            expect.toInfer("c8", componentType("T8"))
            expect.toInfer("c9", componentType("T9"))
            expect.toInfer("c10", componentType("T10"))
        });
    })
})

describe("source", () => {
    describe("overload signatures", () => {
        it("should infer the correct types", () => {
            const expect = expectSnippet(`
                const m = mapTo
                const m1 = m<p.T0, p.T1>(p.c1)
                const s0 = source<p.T0>()
                const s1 = source(m1)
                const s2 = source(m1, m(p.c2))
                const s3 = source(m1, m(p.c2), m(p.c3))
                const s4 = source(m1, m(p.c2), m(p.c3), m(p.c4))
                const s5 = source(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5))
                const s6 = source(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6))
                const s7 = source(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7))
                const s8 = source(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8))
                const s9 = source(m1, m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8), m(p.c9))
                const s10 = source<p.T0, p.T10>(m(p.c1), m(p.c2), m(p.c3), m(p.c4), m(p.c5), m(p.c6), m(p.c7), m(p.c8), m(p.c9), m(p.c10))
            `)
            expect.toSucceed()
            expect.toInfer("s0", "SourceType<T0, T0>")
            expect.toInfer("s1", "SourceType<T0, T1>")
            expect.toInfer("s2", "SourceType<T0, T2>")
            expect.toInfer("s3", "SourceType<T0, T3>")
            expect.toInfer("s4", "SourceType<T0, T4>")
            expect.toInfer("s5", "SourceType<T0, T5>")
            expect.toInfer("s6", "SourceType<T0, T6>")
            expect.toInfer("s7", "SourceType<T0, T7>")
            expect.toInfer("s8", "SourceType<T0, T8>")
            expect.toInfer("s9", "SourceType<T0, T9>")
            expect.toInfer("s10", "SourceType<T0, T10>")
        });

        it("should be callable as a handler", () => {
            const expect = expectSnippet(`
                const m1 = mapTo<p.T0, p.T1>(p.c1)
                const s1 = source(m1)
                s1(p.c0)
            `)
            expect.toSucceed()
        })

        it("should enforce the handler's type", () => {
            const expect = expectSnippet(`
                const m1 = mapTo<p.T0, p.T1>(p.c1)
                const s1 = source(m1)
                s1(p.c2)
            `)
            expect.toFail(/not assignable/i)
        })

        it("should be convertible to an observable", () => {
            const expect = expectSnippet(`
                const m1 = mapTo<p.T0, p.T1>(p.c1)
                const s1 = source(m1)
                const o1 = from(s1)
            `)
            expect.toSucceed()
            expect.toInfer("o1", "Observable<T1>")
        })
    })
})