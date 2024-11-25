import { StyleSheet, Text, View } from 'react-native';
import type { LogRecord } from '../../../types';

interface LogInspectorItemProps extends LogRecord {}

export default function LogInspectorItem({
  type,
  values,
}: LogInspectorItemProps) {
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>
        {type.toUpperCase()}: {JSON.stringify(values)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  text: {
    color: '#000000',
    fontSize: 14,
  },
});
