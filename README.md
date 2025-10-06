[![CI](https://github.com/Sighery/eversports-challenge/actions/workflows/check.yaml/badge.svg)][CI]

# Fullstack Interview Challenge

I've moved the existing README into INSTRUCTIONS.md and I'll use this document
to provide a quick usage refresher, as well as document my implementation
choices in the Task 1 and Task 2 problems.

# Task 1

## Usage

Usage remains exactly as before as I've went with the existing dependencies,
only adding new functionality and commands, not removing. Nevertheless, here
is a quick overview:

```sh
# Installation
npm install

# Serving the backend
npm run start

# Build
npm run build

# Format
npm run format

# Lint
npm run lint

# Test
npm run test
```

## Architecture

I decided to go with a MVC (Model-View-Controller) architecture, and mostly
stuck to the existing dependencies.

Broadly, these are the components I settled on:
* `models`: Database (or in this case JSON) schemas
* `views`: Presentation layer. Only JSON is currently implemented but 
  extensible to other formats
* `controllers`: Handling of incoming requests
* `dtos`: Data transfer objects (models) used in different HTTP requests
* `routes`: Thin layer registering the routes and calling appropriate
  controllers
* `repositories`: Encapsulates access to the different storages, in this case
  just our JSON files, but extensible enough to support actual DB access
* `services`: Some business logic that doesn't belong in controllers, like
  merging/fetching memberships along their membership periods together.
* `transformers`: Different parsers and validators for converting between
  different models, such as models from the `models` layer into `views` layer
  models, or `models` -> `dtos`, etc

Here is a high-level diagram overview of the code flow when a request comes
in:

![Backend Architecture](docs/backend-architecture.png)

### Testing/linting/formatting

Since I'm new to Typescript, I decided to go with the existing testing
framework (`jest`). I've implemented unit tests for the `transformers` and
`repositories` layer, and the rest of the layers are tested indirectly through
a whole flow (from the route through `supertest`) integration test. I could
have also written unit tests for the `services` layer, but in this case I saw
little value over just testing it through the route integration tests.

For formatting I set up `prettier`, and for linting `eslint`. These are now
set up as commands in the `package.json`.

### CI

CI has been set up with Github Actions. Right now this CI will just
automatically check linting/formatting/testing/building. In a proper project,
this would be expanded to apply to Pull Requests instead, and then the `main`
branch pushes would do something useful with the build result, like pushing it
to our server running the backend.

### Concerns

There are a few possible issues I found while trying to migrate this codebase,
mostly relating to the JSON schemas, as well as the `POST /memberships` code.
I've marked these with `NOTE` comments throughout the code, but I'll also
write them down here to provide a bit more context.

#### Membership entity: user

The README mentions this `user` field, but the JSON files use `userId`
instead, while the legacy `POST` code sets it to `user`. For my
implementation, it internally uses `userId`, but in the API response will
expose only `user` as expected to maintain backwards compatibility.

#### Membership entity: assignedBy

The README doesn't mention this `assignedBy` field, but the JSON files contain
it, and the legacy `GET` does return it in the API response. For my
implementation, I've valued backwards compatibility over everything and
decided to include it.

#### MembershipPeriod entity: membership/membershipId

The README only mentions a `membership` field. Likewise, the JSON file only
contains the `membership` field. However, the legacy `POST` code sets
`membershipId`, and that's what it will return in the API response. For my
implementation, I've valued backwards compatibility over everything and
decided to include it.

#### POST /memberships: billingPeriodsLessThan3Years error

The legacy `POST` code will trigger this error when the billing interval is
set to yearly, and the period is set to bigger than 3, but smaller than 10.
This doesn't match the error message, but for my implementation I've decided
to replicate it to maintain backwards compatibility.

#### POST /memberships: cashPriceBelow100 error

The legacy `POST` code will trigger this error when the `paymentMethod` is set
to `cash` **and** the `recurringPrice` is over `100`, which seems to
contradict the error message. For my implementation I've decided to replicate
it to maintain backwards compatibility.

#### POST /memberships: unreachable weekly intervals

The legacy `POST` code has a validation check for `monthly` and `yearly`
intervals, and an else for any other value that will raise
`invalidBillingPeriods`. That means that the `weekly` interval will always be
invalid. I've decided to replicate this behaviour regardless to maintain
backwards compatibility.

[CI]: https://github.com/Sighery/eversports-challenge/actions
