export class AccountAlreadyConfirmedError extends Error {
  constructor() {
    super('Your account was already confirmed')
  }
}
