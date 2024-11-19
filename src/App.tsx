import axios from 'axios';
import { StyleSheet, Text, View } from 'react-native';
import useAppInspector from './lib/useAppInspector';

export default function App() {
  const { isInterceptorEnabled, enableInterceptions, disableInterceptions } =
    useAppInspector();

  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          isInterceptorEnabled()
            ? disableInterceptions()
            : enableInterceptions();
        }}>
        Hello World!!!
      </Text>

      <Text
        onPress={() => {
          const headers = new Headers();
          headers.append('Content-Type', 'application/json');
          // fetch('https://jsonplaceholder.typicode.com/todos/1', { headers });
          axios('https://jsonplaceholder.typicode.com/todos/1');
        }}>
        Call API
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 64,
  },
});
