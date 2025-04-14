import { Data } from "effect"

export class SqlError extends Data.TaggedError("SqlError")<{
  message: string
  code: number
}> {
  constructor({ message, code = 500 }: { message: string, code?: number }) {
    super({ message, code })
  }
}

export class MissingParameterError extends Data.TaggedError("MissingParameterError")<{
  message: string
  code: number
}> {
  constructor({ message, code = 400 }: { message: string, code?: number }) {
    super({ message, code })
  }
}

export class NotFoundError extends Data.TaggedError("NotFoundError")<{
  message: string
  code: number
}> {
  constructor({ message, code = 404 }: { message: string, code?: number }) {
    super({ message, code })
  }
}

export class NoSessionAvailableError extends Data.TaggedError("NoSessionAvailableError") <{
  code: number
}> {
  constructor({ code = 401 }: { code?: number } = {}) {
    super({ code })
  }
}

export class UnauthorizedError extends Data.TaggedError("UnauthorizedError") <{
  code: number
}> {
  constructor({ code = 403 }: { code?: number } = {}) {
    super({ code })
  }
}

export class AlreadyExistsError extends Data.TaggedError("AlreadyExistsError")<{
  message: string
  code: number
}> {
  constructor({ message, code = 400 }: { message: string, code?: number }) {
    super({ message, code })
  }
}
