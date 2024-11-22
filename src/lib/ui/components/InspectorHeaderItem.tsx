import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { hexToHexAlpha } from '../../utils';

interface InspectorHeaderItemProps {
  title: string;
  onPress: () => void;
}

export default function InspectorHeaderItem({
  title,
  onPress,
}: InspectorHeaderItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
});
