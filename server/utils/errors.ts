import { Data } from "effect"

export class UnknownDatabaseError extends Data.TaggedError("UnknownDatabaseError")<{
  message: string
}> {}

export class DatabaseTypeError extends Data.TaggedError("DatabaseTypeError")<{
  message: string
}> {}

export class NoSessionAvailableError extends Data.TaggedError("NoSessionAvailableError") {}

export class UnauthorizedError extends Data.TaggedError("UnauthorizedError") {}
