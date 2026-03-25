import { TestCase } from '@/types/game'
import { EDITOR_DATA } from './constants'

export function runTests(code: string, tests: Omit<TestCase, 'passed'>[]): TestCase[] {
    const patterns: Record<string, (code: string) => boolean> = {
        // variables
        't1-4-01': c => /\b(let|const)\s+\w+/.test(c),
        't2-4-01': c => /robot\.move\s*\(\s*\w+\s*\)/.test(c),

        // funciones
        't1-4-03': c => /\bfunction\b/.test(c),
        't2-4-03': c => /function\s+\w+\s*\(\s*\w+/.test(c),
        't3-4-03': c => {
            const fnMatch = c.match(/function\s+(\w+)/)
            if (!fnMatch) return false
            const name = fnMatch[1]
            return new RegExp(name + '\\s*\\(').test(c.replace(`function ${name}`, ''))
        },

        // arrays
        't1-4-05': c => /\[[\s\S]*?\]/.test(c),
        't2-4-05': c => /\.forEach\s*\(/.test(c),
        't3-4-05': c => /robot\.activate\s*\(/.test(c) && /\.forEach\s*\(/.test(c),

        // objetos
        't1-4-07': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't2-4-07': c => {
            const objMatch = c.match(/\{([\s\S]*?)\}/)
            if (!objMatch) return false
            const props = objMatch[1].split(',').filter(p => p.includes(':'))
            return props.length >= 2
        },
        't3-4-07': c => /\w+\.\w+/.test(c),

        // callbacks
        't1-4-08': c => /function\s+\w+\s*\(\s*\w+\s*,\s*\w+/.test(c),
        't2-4-08': c => {
            const paramMatch = c.match(/function\s+\w+\s*\(\s*\w+\s*,\s*(\w+)/)
            if (!paramMatch) return false
            const cbParam = paramMatch[1]
            return new RegExp(cbParam + '\\s*\\(').test(c)
        },
        't3-4-08': c => /\bfunction\b[\s\S]*?\bfunction\b/.test(c),

        // nivel 4-10
        't1-4-10': c => /\b(let|const)\s+\w+/.test(c),
        't2-4-10': c => /\bfunction\b/.test(c),
        't3-4-10': c => /\[[\s\S]*?\]/.test(c),
        't4-4-10': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't5-4-10': c => /robot\.activate\s*\(/.test(c),

        // nivel final 5-02
        't1-5-02': c => /\b(let|const)\s+\w+/.test(c),
        't2-5-02': c => /\bfunction\b/.test(c),
        't3-5-02': c => /\[[\s\S]*?\]/.test(c),
        't4-5-02': c => /\{[\s\S]*?:[\s\S]*?\}/.test(c),
        't5-5-02': c => /\.forEach\s*\(|for\s*\(/.test(c),
        't6-5-02': c => /\bif\s*\(/.test(c),
        't7-5-02': c => /function[\s\S]*?function/.test(c),
        't8-5-02': c => /genesis\.activar\s*\(/.test(c),
    }

    return tests.map(test => {
        const levelId = Object.keys(EDITOR_DATA).find(k =>
            EDITOR_DATA[k].tests.some(t => t.id === test.id)
        ) ?? ''
        const key = `${test.id}-${levelId}`

        const fn = patterns[key]
        const passed = fn ? fn(code) : code.trim().length > 0

        return { ...test, passed } as TestCase
    })
}
