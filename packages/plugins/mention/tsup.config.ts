import { defineConfig } from 'tsup'
import defaultConfig from 'tsup-config'

export default defineConfig((options) => ({
  ...(defaultConfig(options) as any),
  entry: ['src/index.ts', 'src/serializer/html.ts', 'src/serializer/text.ts', 'src/deserializer/html.ts'],
}))
