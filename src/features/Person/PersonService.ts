import type { PersonServiceFastifyInstance } from './index'

export default function PersonService(f: PersonServiceFastifyInstance) {
  function sendNotification() {
    f.log.info('sent notification')
  }

  return {
    sendNotification,
  }
}
