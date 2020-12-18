const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = [];
const subscribers = [];
const onMessagesUpdates = fn => {
  subscribers.push(fn);
};
const channel = Math.random()
  .toString(36)
  .slice(2, 15);

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        content: String!
    }

    type Query {
        messages: [Message!]!
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }

    type Subscription {
        messages: [Message!]
    }
`;

const resolvers = {
  Query: {
    messages: () => messages
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content
      });
      pubsub.publish(channel, { messages });
      return id;
    }
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      }
    }
  }
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });
server.start(({ port }) => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
