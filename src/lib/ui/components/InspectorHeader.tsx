import { ScrollView, StyleSheet } from 'react-native';
import InspectorHeaderItem from './InspectorHeaderItem';

interface InspectorHeaderProps {
  hideInspector: () => void;
  clearAllRecords: () => void;
  moveInspectorToUp: () => void;
  moveInspectorToDown: () => void;
}

export default function InspectorHeader({
  hideInspector,
  clearAllRecords,
  moveInspectorToUp,
  moveInspectorToDown,
}: InspectorHeaderProps) {
  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      <InspectorHeaderItem onPress={hideInspector} title="Hide Inspector" />

      <InspectorHeaderItem
        onPress={clearAllRecords}
        title="Clear All Network Records"
      />

      <InspectorHeaderItem onPress={moveInspectorToUp} title="Move Up" />

      <InspectorHeaderItem onPress={moveInspectorToDown} title="Move Down" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: 4,
    columnGap: 4,
  },
});
