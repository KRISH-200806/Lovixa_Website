import { Section, Heading, Text, Button } from '@/components/ui'

export default function NotFound() {
  return (
    <Section spacing="lg" containerSize="sm" className="text-center">
      <Heading as="h1" size={2} className="mb-4">
        Page not found
      </Heading>
      <Text tone="muted" className="mb-8">
        The page you requested does not exist.
      </Text>
      <Button href="/">Back to home</Button>
    </Section>
  )
}
