import axios from 'axios';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import XenonInspector from './lib';

// StatusBar.setTranslucent(true);
// StatusBar.setBackgroundColor('transparent');

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(res => res.json())
            .then(console.log);
        }}
      >
        <Text>FetchAPI: Get post</Text>
      </TouchableOpacity>

      <TouchableOpacity
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
          })
            .then(res => res.json())
            .then(console.log);
        }}
      >
        <Text>FetchAPI: Create post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          axios('https://jsonplaceholder.typicode.com/posts?userId=1').then(
            console.log,
          );
        }}
      >
        <Text>Axios: Get posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          axios
            .post('https://jsonplaceholder.typicode.com/posts', {
              title: 'foo',
              body: 'bar',
              userId: 1,
            })
            .then(console.log);
        }}
      >
        <Text>Axios: Create post</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // Create WebSocket connection.
          const socket = new WebSocket('wss://echo.websocket.org');

          const message = `Hello Server! It's ${new Date().toISOString()}`;

          // Connection opened
          socket.onopen = () => {
            socket.send(message);
            console.log('send', message);
          };

          socket.onmessage = event => {
            console.log('onmessage', event.data);
            if (event.data === message) {
              socket.close();
            }
          };
        }}
      >
        <Text>Echo Websocket</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          XenonInspector.show();
        }}
      >
        <Text>Show Inspector</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          XenonInspector.hide();
        }}
      >
        <Text>Hide Inspector</Text>
      </TouchableOpacity>

      <XenonInspector.Component />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
