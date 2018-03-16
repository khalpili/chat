// @flow

import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  View,
  Platform,
} from 'react-native';
// import UUID from 'swarm-ron-uuid';
import moment from 'moment';
import type { Profile } from './auth0';
import * as utils from './utils';

export type User = {
  id: string,
  version: string,
  username: string,
  name: string,
  picture: string,
  email: string,
};

export type Message = {
  id: string,
  createdAt: string | Date,
  text: string,
  user: User,
  system: boolean,
};

export type Chat = {
  id: string,
  version: string,
  picture: string,
  title: string,
  messages: Message[],
};

type Props = {
  profile: Profile,
  chats: {
    id: string,
    version: string,
    length: number,
    list: Chat[],
  },
  onPress: (chat: Chat) => void,
};

export default class ChatList extends React.Component<Props, *> {
  _renderItem = (
    item: Chat,
    separators: { highlight: any, unhighlight: any },
    id: string,
  ) => {
    const m = item.messages[0];
    if (!(m.createdAt instanceof Date)) {
      m.createdAt = utils.parseDate(m.createdAt);
    }
    // const name = m.user && m.user.id === id ? 'You' : m.user.name;

    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}>
        <View style={styles.cell}>
          <Image style={styles.picture} source={{ uri: item.picture }} />
          <View style={styles.inner}>
            <View style={styles.innerTop}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.date}>{moment(m.createdAt).fromNow()}</Text>
              {/* last message date */}
            </View>
            <View>
              <Text
                style={styles.message}
                numberOfLines={2}
                ellipsizeMode="tail">
                {/* m.text */}
                Adding justifyContent to a component's style determines the
                distribution of children along the primary axis
              </Text>
            </View>
          </View>
          <Image style={styles.arrow} source={require('./arrow.png')} />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { profile: { uuid }, chats } = this.props;
    const id = uuid.toString();
    console.log('chat list', chats);
    return (
      <FlatList
        ItemSeparatorComponent={Platform.select({
          ios: () => <View style={[styles.separator]} />,
        })}
        data={chats.list}
        keyExtractor={(item: Chat) => item.id}
        renderItem={({ item, separators }) =>
          this._renderItem(item, separators, id)
        }
      />
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    width,
  },
  arrow: {
    width: 7,
    height: 12,
    resizeMode: 'contain',
    marginTop: 3,
    marginRight: 6,
    tintColor: '#aaa',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  innerTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    marginTop: 2,
    marginRight: 5,
    color: '#aaa',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  message: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  picture: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    marginRight: 10,
    marginLeft: 6,
    marginVertical: 5,
  },
  separator: {
    width: width - 20,
    marginLeft: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
