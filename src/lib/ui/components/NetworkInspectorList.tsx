import { FlatList, StyleSheet, Text, View } from 'react-native';

interface NetworkInspectorListProps<T extends Map<any, any>> {
  data: T;
}

const Separator = () => <View style={styles.divider} />;

export default function NetworkInspectorList<T extends Map<any, any>>({
  data,
}: NetworkInspectorListProps<T>) {
  return (
    <FlatList
      data={Array.from(data)}
      style={styles.container}
      ItemSeparatorComponent={Separator}
      keyExtractor={([key]) => key}
      renderItem={({ item: [_, item] }) => {
        return <Text>{JSON.stringify(item, null, 2)}</Text>;
      }}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
});
