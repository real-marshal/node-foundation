export default async function globalTeardown() {
  await globalThis.postgresContainer.stop()
}
