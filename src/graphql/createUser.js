// @flow

import gql from 'graphql-tag';

export default gql`
  mutation createUser($id: UUID!, $payload: Payload!) {
    userCreated: set(id: $id, payload: $payload)
  }
`;
