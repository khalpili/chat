// @flow

import gql from 'graphql-tag';

export default gql`
  subscription chatListScreen($from: Int = 0, $to: Int, $user: UUID!) {
    chats @node(id: "chats") {
      id
      version
      length
      list: id @node @slice(begin: $from, end: $to) @static {
        id
        version
        title
        picture
        messages {
          id
          length
          version
          list: id @node @slice(begin: 0, end: 1) @static {
            _id: id
            createdAt: id @date
            text
            user @static {
              _id: id
              name
              avatar: picture
            }
          }
        }
      }
    }
    user @node(id: $user) @static {
      id
      version
      username: nickname
      name
      picture
    }
  }
`;
