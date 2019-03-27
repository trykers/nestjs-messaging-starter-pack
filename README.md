# Nest.js messenger starter pack API

This starter pack is an messenger API. Created with Nest.js progressive framework.

Using Redis + MongoDB + Apollo GraphQL

The best combo ever !

This app is just a starter pack. You can upgrade it to have the best messenger API in the world. 

## Installation

Type the following command in the starter pack directory to install the dependencies.

```bash
yarn
```

Create a Redis server and a MongoDB instance.

You can get a [Redis Server here](https://redislabs.com/) and get a [MongoDB database here](https://www.mongodb.com/) for free.

Set the environment variables :
```bash
# REDIS VARS
export REDIS_ENDPOINT="[YOUR_URL]"
export REDIS_PORT=[PORT]
export REDIS_PASS=[PASSWORD]

# MONGODB VARS
export MONGO_CONNECT_STR="[MONGO_CONNECTION_STRING_WITHOUT_USERNAME_AND_PASSWORD]" 
# LIKE THIS : nodejs-xlxkf.gcp.mongodb.net/[DB_NAME]?retryWrites=true
export MONGO_USER="[USERNAME]"
export MONGO_PASS="PASSWORD"
```

## Usage

And to launch the app :
```bash
yarn run start
```

The server is now running on port 3000.

[http://127.0.0.1:3000/](http://127.0.0.1:3000/)

## GraphQL Queries
### Create an user (mutation)
```gql
createUser(firstname: String!, lastname: String!, password: String!, email: String!): User
```

User object: 
```gql
type User {
    firstname: String!
    lastname: String!
    email: String!
    token: String!
    role: Roles
    avatar: String
}
```


### Create a messenger thread
This mutation help you to create a thread messaging between two user (or more if you upgrade the mutation)
```gql
createThread(recipientemail: String!): Messaging
```

Messaging object:
```gql
type Messaging {
    messages: [Message]!
    users: [MUser]!
    threadid: String!
}
````

MUser object:
```gql
type MUser {
    firstname: String!
    lastname: String!
    email: String!
    avatar: String!
}
````

To get thread content use this query :
```gql
thread(threadid: String!): Messaging
```

### Send a message

Now you can send a message with this following mutation :
```gql
mutation 
sendMessage(threadid: String!, body: String!): Message
```
Body is the message. Threadid is the created thread id. You can get all the user's thread id by executing 
```gql
query {
    allthread: [String]!
}
```

Message object:
```gql
type Message {
    author: MUser!
    date: Date!
    body: String!
    readby: [MUser]!
    threadid: String!
}
```

### Receive a message !
To receive a message you need to subscribe :
```gql
newMessageAppend(threadid: String!): Message
```


## License
[MIT](https://choosealicense.com/licenses/mit/)
