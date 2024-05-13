export class EmailAlreadyTakenError extends Error {
  constructor() {
    super('Email already taken.')
  }
}
