export interface User {
    readonly id: String,
    readonly firstname: String,
    readonly lastname: String,
    readonly password: String,
    readonly email: String,
    readonly role: String,
    readonly token: String,
    readonly contacts: [String],
    readonly avatar?: String,
}
