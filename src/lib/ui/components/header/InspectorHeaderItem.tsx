import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ImageRequireSource,
} from 'react-native';

interface InspectorHeaderItemProps {
  content?: ImageRequireSource | string;
  onPress: () => void;
}

export default function InspectorHeaderItem({
  content,
  onPress,
}: InspectorHeaderItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {typeof content === 'string' ? (
        <Text style={styles.title}>{content}</Text>
      ) : (
        <Image source={content} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#888888',
  },
  title: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
    color: '#000000',
  },
  icon: {
    width: 17,
    height: 17,
  },
});
