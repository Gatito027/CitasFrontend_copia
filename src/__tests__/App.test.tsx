// src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react'
import App from '../App'
import { expect, test } from 'vitest'

test('renderiza correctamente', () => {
  render(<App />)
  expect(screen.getByText(/citas/i)).toBeInTheDocument()
})