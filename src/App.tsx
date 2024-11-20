import axios from 'axios';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import useAppInterceptor from './lib/useAppInterceptor';

const Separator = () => <View style={styles.divider} />;

export default function App() {
  const { requests } = useAppInterceptor();

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Text
              onPress={() => {
                // enableInterceptions();
              }}>
              Hello World!!!
            </Text>

            <Text
              onPress={() => {
                // fetch('https://jsonplaceholder.typicode.com/todos/1');
                axios('https://jsonplaceholder.typicode.com/todos/1');
              }}>
              Call API
            </Text>
          </View>
        }
        stickyHeaderIndices={[0]}
        data={Array.from(requests)}
        ItemSeparatorComponent={Separator}
        keyExtractor={([key]) => key}
        renderItem={({ item: [_, item] }) => {
          return <Text>{JSON.stringify(item, null, 2)}</Text>;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderWidth: 1,
    gap: 16,
    backgroundColor: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
  },
  item: {},
  itemText: {},
});
