import { ScrollView, StyleSheet, Text } from 'react-native';
import type { LogRecord } from '../../../types';
import { hexToHexAlpha } from '../../../utils';

interface LogDetailsProps {
  item: LogRecord;
}

export default function LogDetails({ item }: LogDetailsProps) {
  return (
    <ScrollView style={styles.container}>
      <Text>{JSON.stringify(item, null, 2)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
});
