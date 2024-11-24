import { ScrollView, StyleSheet } from 'react-native';
import InspectorHeaderItem from './InspectorHeaderItem';

interface InspectorHeaderProps {
  hideInspectorPanel: () => void;
  clearAllRecords: () => void;
  toggleInspectorPosition: () => void;
  toggleNetworkInterception: () => void;
  isInterceptorEnabled: boolean;
}

export default function InspectorHeader({
  hideInspectorPanel,
  clearAllRecords,
  toggleInspectorPosition,
  toggleNetworkInterception,
  isInterceptorEnabled,
}: InspectorHeaderProps) {
  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      <InspectorHeaderItem
        onPress={hideInspectorPanel}
        content={require('../../../assets/hide.png')}
      />

      <InspectorHeaderItem
        onPress={toggleInspectorPosition}
        content={require('../../../assets/move.png')}
      />

      <InspectorHeaderItem
        onPress={toggleNetworkInterception}
        content={
          isInterceptorEnabled ? 'Stop Recording Network' : 'Start Network Log'
        }
      />

      <InspectorHeaderItem
        onPress={clearAllRecords}
        content="Clear All Network Records"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: 8,
    columnGap: 8,
  },
});
