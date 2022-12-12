import type { AppFastifyInstance } from './app'
import registerDBPlugin from '@/features/DB'
import registerPersonPlugin from '@/features/Person'

export default async function registerPlugins(f: AppFastifyInstance) {
  void registerDBPlugin(f)
  void registerPersonPlugin(f)
}
