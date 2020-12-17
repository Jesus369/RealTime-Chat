import React from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

import { Container } from "shards-react";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache()
});

const GET_MESSAGES = gql`
  query GET_MESSAGES {
    messages {
      id
      user
      content
    }
  }
`;

const Messages = ({ user }) => {
  const { data, loading } = useQuery(GET_MESSAGES);
  if (loading) return <div>Loading</div>;

  return (
    <div>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em"
          }}
        >
          <ul
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%"
            }}
          >
            <li>{content}</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

const Chat = () => {
  return (
    <div>
      <Messages user="Jack" />
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
