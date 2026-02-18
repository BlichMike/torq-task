import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { server } from './server'

configure({ testIdAttribute: 'data-hook' })

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
