import { Data } from "effect"

export class NoSessionAvailableError extends Data.TaggedError("NoSessionAvailableError") {}

export class UnauthorizedError extends Data.TaggedError("UnauthorizedError") {}

export class AlreadyExistsError extends Data.TaggedError("AlreadyExistsError")<{
  message: string
}> { }
