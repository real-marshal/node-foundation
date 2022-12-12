import Fastify, { FastifyInstance } from 'fastify'
import config from '@/app/config'
import registerDBPlugin from '../../DB'
import PersonRepository from '../PersonRepository'

describe('PersonRepository', () => {
  let f: FastifyInstance

  beforeAll(async () => {
    f = Fastify(config)
    await registerDBPlugin(f)
  })

  afterAll(async () => {
    await f.close()
  })

  it('should have CRUD functions', () => {
    const createCRUDMock = jest.spyOn(f.DBService, 'createCRUD')
    const personRepository = PersonRepository(f)

    expect(personRepository).toMatchObject(createCRUDMock.mock.results[0]?.value)
  })

  it('should have countPersons function that counts persons', async () => {
    const personRepository = PersonRepository(f)

    await personRepository.create({ name: 'alex', email: 'alex@gmail.com' })
    await personRepository.create({ name: 'bob', email: 'bob@gmail.com' })

    expect(await personRepository.countPersons()).toBe(2)
  })
})
