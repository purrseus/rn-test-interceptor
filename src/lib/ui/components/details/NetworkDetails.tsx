import { Text, ScrollView, StyleSheet } from 'react-native';
import type { HttpRecord, WebSocketRecord } from '../../../types';
import { hexToHexAlpha } from '../../../utils';

interface NetworkDetailsProps {
  item: HttpRecord | WebSocketRecord;
}

export default function NetworkDetails({ item }: NetworkDetailsProps) {
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
