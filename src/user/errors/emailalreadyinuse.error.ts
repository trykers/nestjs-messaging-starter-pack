export class EmailAlreadyInUseError extends Error {
    readonly code = 422
    readonly message = 'The given email is already in use. Please try again with different email or login in.'
}