import type { AppFastifyInstance } from '@/app/app'
import PersonController from './PersonController'
import PersonRepository from './PersonRepository'
import PersonService from './PersonService'

export interface PersonServiceFastifyInstance extends AppFastifyInstance {
  personRepository: ReturnType<typeof PersonRepository>
}

export interface PersonControllerFastifyInstance extends PersonServiceFastifyInstance {
  personService: ReturnType<typeof PersonService>
}

async function PersonPlugin(f: AppFastifyInstance) {
  f.decorate('personRepository', PersonRepository(f))
  f.decorate('personService', PersonService(f as PersonServiceFastifyInstance))

  PersonController(f as PersonControllerFastifyInstance)
}

export default async function registerPersonPlugin(f: AppFastifyInstance) {
  return f.register(PersonPlugin, { prefix: 'person' })
}
