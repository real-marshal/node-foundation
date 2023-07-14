import type { PersonControllerFastifyInstance } from './index'
import { Type } from '@sinclair/typebox'
import type { PersonId } from '@/schemas'

export default function PersonController(f: PersonControllerFastifyInstance) {
  f.get(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
            name: Type.String(),
            email: Type.String(),
          }),
        },
        tags: ['person'],
        operationId: 'getPerson',
      },
    },
    async (request) => {
      return f.personRepository.get(request.params.id as PersonId)
    }
  )

  f.post(
    '/',
    {
      schema: {
        body: Type.Object({
          name: Type.String(),
          email: Type.String(),
        }),
        tags: ['person'],
        operationId: 'createPerson',
      },
    },
    async (request) => {
      await f.personRepository.create(request.body)
    }
  )

  f.put(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Integer(),
        }),
        body: Type.Partial(
          Type.Object({
            name: Type.String(),
            email: Type.String(),
          })
        ),
        tags: ['person'],
        operationId: 'updatePerson',
      },
    },
    async (request) => {
      await f.personRepository.update(request.params.id as PersonId, request.body)
    }
  )

  f.delete(
    '/:id',
    {
      schema: {
        params: Type.Object({
          id: Type.Integer(),
        }),
        tags: ['person'],
        operationId: 'deletePerson',
      },
    },
    async (request) => {
      await f.personRepository.delete(request.params.id as PersonId)
    }
  )

  f.get(
    '/count',
    {
      schema: {
        response: {
          200: Type.Integer(),
        },
        tags: ['person'],
        operationId: 'countPersons',
      },
    },
    async () => {
      return f.personRepository.countPersons()
    }
  )
}
