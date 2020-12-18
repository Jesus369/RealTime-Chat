import React, { state, useState } from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql
} from "@apollo/client";

import { WebSocketLink } from "@apollo/client/link/ws";

import { Container, Row, Col, FormInput, Button } from "shards-react";

const link = new WebSocketLink({
  uri: "ws://localhost:4000/",
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache()
});

// GQL FUNCTIONS
const GET_MESSAGES = gql`
  subscription GET_MESSAGES {
    messages {
      id
      user
      content
    }
  }
`;

const POST_MESSAGE = gql`
  mutation POST_MESSAGE($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

// RENDERING MESSAGES COMPONENT
const Messages = ({ user }) => {
  const { data, loading } = useSubscription(GET_MESSAGES);
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
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #e5e6ea",
                borderRadius: 20,
                textAlign: "center",
                fontSize: "11pt",
                paddingTop: 5
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "60%"
            }}
          >
            {content}
          </div>
        </div>
      ))}
    </div>
  );
};

// POSTING MESSAGE COMPONENT
const Chat = () => {
  const [state, setState] = useState({
    user: "Jack",
    content: ""
  });
  const [postMessage, { data }] = useMutation(POST_MESSAGE);

  let { user, content } = state;
  const onSend = () => {
    if (content.length > 0) {
      postMessage({
        variables: {
          user: user,
          content: content
        }
      });
    }

    setState({
      ...state,
      content: ""
    });
  };
  return (
    <Container>
      <Messages user={user} />
      <Row>
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="User"
            value={state.user}
            onChange={e => {
              setState({
                ...state,
                user: e.target.value
              });
            }}
          />
        </Col>
        <Col cs={8}>
          <FormInput
            label="Content"
            value={state.content}
            onChange={e => {
              setState({
                ...state,
                content: e.target.value
              });
            }}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button
            onClick={() => {
              onSend();
            }}
          >
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
