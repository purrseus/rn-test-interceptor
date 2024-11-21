import axios from 'axios';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useNetworkInterceptor from './lib/useNetworkInterceptor';

const Separator = () => <View style={styles.divider} />;

export default function App() {
  const { records, clearAllRecords } = useNetworkInterceptor();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
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
                  console.log('Client is sending message:', message);
                };

                socket.onmessage = event => {
                  console.log('Message from server:', event.data);

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
          </View>
        }
        stickyHeaderIndices={[0]}
        data={Array.from(records)}
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
