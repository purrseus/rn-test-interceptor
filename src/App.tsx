import axios from 'axios';
import { useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RelensInspector, {
  type RelensInspectorMethods,
} from './lib/ui/RelensInspector';

StatusBar.setTranslucent(true);
StatusBar.setBackgroundColor('#00000000');
StatusBar.setBarStyle('dark-content');

export default function App() {
  const relensInspector = useRef<RelensInspectorMethods | null>(null);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            fetch('https://jsonplaceholder.typicode.com/todos/1');
          }}>
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
            });
          }}>
          <Text>FetchAPI: Create post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            axios('https://jsonplaceholder.typicode.com/todos/1');
          }}>
          <Text>Axios: Get post</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            axios.post('https://jsonplaceholder.typicode.com/posts', {
              title: 'foo',
              body: 'bar',
              userId: 1,
            });
          }}>
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
            };

            socket.onmessage = event => {
              if (event.data === message) {
                socket.close();
              }
            };
          }}>
          <Text>Echo Websocket</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            relensInspector.current?.show();
          }}>
          <Text>Show Inspector</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            relensInspector.current?.hide();
          }}>
          <Text>Hide Inspector</Text>
        </TouchableOpacity>

        <RelensInspector ref={relensInspector} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
