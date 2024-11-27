import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { LogRecord } from '../../../types';

interface LogInspectorItemProps extends LogRecord {
  onPress: () => void;
}

export default function LogInspectorItem({ type, values, onPress }: LogInspectorItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>
        {type.toUpperCase()}
        {': '}
        {values.map((value, index, array) => {
          const isLastItem = index === array.length - 1;
          const text =
            typeof value === 'string' ? value : JSON.stringify(value);

          return text + (isLastItem ? '' : ' ');
        })}
      </Text>
    </TouchableOpacity>
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
