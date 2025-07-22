import { createFileRoute } from '@tanstack/react-router'
import Characters from '../components/Characters'

export const Route = createFileRoute('/')({
  component: Characters,
})
