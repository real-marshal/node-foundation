import Fastify, { FastifyInstance } from 'fastify'
import config from '@/app/config'
import PersonController from '../PersonController'
import type { PersonControllerFastifyInstance } from '../index'
import type { PersonInitializer, PersonMutator } from '@/schemas'
import setValidator from '@/app/setValidator'

describe('PersonController', () => {
  let f: FastifyInstance

  beforeEach(async () => {
    f = Fastify(config)

    setValidator(f)

    await f.register(
      async (f) => {
        PersonController(f as PersonControllerFastifyInstance)
      },
      { prefix: 'person' }
    )
  })

  afterEach(async () => {
    await f.close()
  })

  describe('get method', () => {
    it(`should call repository's get`, async () => {
      f.decorate('personRepository', {
        get: jest.fn(async (id: number) => ({
          id,
          name: 'name',
          email: 'email',
        })),
      })

      const response = await f.inject().get('person/1')

      expect(response.statusCode).toBe(200)
      expect(response.json()).toEqual({
        id: 1,
        name: 'name',
        email: 'email',
      })
    })

    it('should validate request params', async () => {
      const response = await f.inject().get('person/dsfs')

      expect(response.statusCode).toBe(400)
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "error": "Bad Request",
          "message": "params/id must be integer",
          "statusCode": 400,
        }
      `)
    })

    it('should validate response body', async () => {
      f.decorate('personRepository', {
        get: jest.fn(async (id: number) => ({
          id,
          name: 'name',
          email: 'email',
          password: 'cool_password',
        })),
      })
      const response = await f.inject().get('person/1')

      expect(response.statusCode).toBe(200)
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "email": "email",
          "id": 1,
          "name": "name",
        }
      `)
    })
  })
  describe('post method', () => {
    it(`should call repository's create`, async () => {
      const createMock = jest.fn(async (values: PersonInitializer) => void values)

      f.decorate('personRepository', {
        create: createMock,
      })

      const response = await f.inject().post('person').body({
        name: 'name',
        email: 'email',
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeEmpty()
      expect(createMock).toHaveBeenCalledWith({ name: 'name', email: 'email' })
    })

    it('should validate request body', async () => {
      const response = await f.inject().post('person').body({
        name: 'name',
        wtf: 'is this',
      })

      expect(response.statusCode).toBe(400)
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "error": "Bad Request",
          "message": "body must have required property 'email'",
          "statusCode": 400,
        }
      `)
    })
  })

  describe('put method', () => {
    it(`should call repository's update`, async () => {
      const updateMock = jest.fn(async (_: number, values: PersonMutator) => void values)

      f.decorate('personRepository', {
        update: updateMock,
      })

      const response = await f.inject().put('person/1').body({
        email: 'new_email',
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeEmpty()
      expect(updateMock.mock.calls[0]).toEqual([1, { email: 'new_email' }])
    })

    it('should validate request params', async () => {
      const response = await f.inject().put('person/dsfs')

      expect(response.statusCode).toBe(400)
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "error": "Bad Request",
          "message": "params/id must be integer",
          "statusCode": 400,
        }
      `)
    })

    it('should validate request body', async () => {
      const updateMock = jest.fn(async (_: number, values: PersonMutator) => void values)

      f.decorate('personRepository', {
        update: updateMock,
      })

      const response = await f.inject().put('person/1').body({
        wd: 'name',
        wtf: 'is this',
      })

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeEmpty()
      expect(updateMock.mock.calls[0]).toEqual([1, {}])
    })
  })

  describe('delete method', () => {
    it(`should call repository's delete`, async () => {
      const deleteMock = jest.fn(async (id: number) => void id)

      f.decorate('personRepository', {
        delete: deleteMock,
      })

      const response = await f.inject().delete('person/1')

      expect(response.statusCode).toBe(200)
      expect(response.body).toBeEmpty()
      expect(deleteMock).toHaveBeenCalledWith(1)
    })

    it('should validate request params', async () => {
      const response = await f.inject().delete('person/dsfs')

      expect(response.statusCode).toBe(400)
      expect(response.json()).toMatchInlineSnapshot(`
        {
          "error": "Bad Request",
          "message": "params/id must be integer",
          "statusCode": 400,
        }
      `)
    })
  })
})
