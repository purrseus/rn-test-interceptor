import axios from 'axios';
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useNetworkInterceptor from './lib/useNetworkInterceptor';
import { useEffect, useRef } from 'react';

const Separator = () => <View style={styles.divider} />;

export default function App() {
  const flatListRef = useRef<FlatList | null>(null);
  const { networkRecords, clearAllRecords } = useNetworkInterceptor();

  useEffect(() => {
    if (networkRecords.size) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1000);
    }
  }, [networkRecords.size]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        ListHeaderComponent={
          <ScrollView horizontal style={styles.header}>
            <Button
              onPress={() => {
                fetch('https://jsonplaceholder.typicode.com/todos/1');
              }}
              title="FetchAPI: Get post"
            />

            <Button
              onPress={() => {
                fetch('https://jsonplaceholder.typicode.com/posts', {
                  method: 'POST',
                  body: JSON.stringify({
                    title: 'foo',
                    body: 'bar',
                    userId: 1,
                  }),
                  headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },
                });
              }}
              title="FetchAPI: Create post"
            />

            <Button
              onPress={() => {
                axios('https://jsonplaceholder.typicode.com/todos/1');
              }}
              title="Axios: Get post"
            />

            <Button
              onPress={() => {
                axios.post('https://jsonplaceholder.typicode.com/posts', {
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                });
              }}
              title="Axios: Create post"
            />

            <Button
              onPress={() => {
                // Create WebSocket connection.
                const socket = new WebSocket('wss://echo.websocket.org');

                const message = `Hello Server! It's ${new Date().toISOString()}`;

                // Connection opened
                socket.onopen = () => {
                  socket.send(message);
                };

                socket.onmessage = event => {
                  if (event.data === message) {
                    socket.close();
                  }
                };
              }}
              title="Echo Websocket"
            />

            <Button
              onPress={() => {
                clearAllRecords();
              }}
              title="Clear All Records"
            />
          </ScrollView>
        }
        stickyHeaderIndices={[0]}
        data={Array.from(networkRecords)}
        ItemSeparatorComponent={Separator}
        keyExtractor={([key]) => key}
        renderItem={({ item: [_, item] }) => {
          return <Text>{JSON.stringify(item, null, 2)}</Text>;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
  },
  item: {},
  itemText: {},
});
