# node-foundation

## Features
- Classical MVC architecture similar to Nest.js based on `fastify` plugin encapsulation
- Testing with `jest` + `node-testcontainers` for DB staff etc.
- Migrations done with `knex`, DB schema is linted and TS types generated for all schemas after each migration (`schemalint`, `kanel`)
- `hygen` templates for generating new features
- Releases & automatic version/changelog generation based on conventional commits with `semantic-release`
- Configured CI/CD with GitHub Actions
- Dockerfile for production build

## Prerequisites

- nvm
- docker

## Get started

1. Select correct node version `nvm use`
2. Install dependencies `yarn install`
3. Launch dev server `yarn dev`

## Notes

- Included `Dockerfile` is meant for deployment only while `docker-compose.yml` is for development.
- For CI `tests` workflow is used. `release` workflow tags the repo, generates changelog, bumps the version in package.json, builds a docker image, pushes it to GitHub registry and creates a release on GitHub with changes listed. Commit messages should adhere to the conventional commits spec for all of this to work correctly.
- Check out `hygen` docs and `_templates` folder to learn how to use included generators

## Explaining decisions
- Even though my [react-foundation](https://github.com/real-marshal/react-foundation/) uses yarn pnp I decided to use node-modules here instead due to runtime performance uncertainties. I could bundle all dependencies instead, but I don't think it's really needed here.
- I don't use ESM due to 2 reasons (both of them are pretty insignificant and have alternative solutions, but I prefer it this way):
  1. ts-node-dev still [doesn't work](https://github.com/wclr/ts-node-dev/issues/312) with it.
  2. TS resolveJsonModule also works only with CommonJS at the moment (and I guess it won't change until import assert gets stable).
