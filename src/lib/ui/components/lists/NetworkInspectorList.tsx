import { useCallback, useContext, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import {
  NetworkType,
  type HttpRecord,
  type ID,
  type WebSocketRecord,
} from '../../../types';
import { hexToHexAlpha } from '../../../utils';
import XenonInspectorContext from '../../contexts/XenonInspectorContext';
import NetworkInspectorItem from './NetworkInspectorItem';
import NetworkInspectorListHeader from './NetworkInspectorListHeader';

const Separator = () => <View style={styles.divider} />;

export default function NetworkInspectorList() {
  const {
    networkInterceptor: { networkRecords },
    setPanelSelected,
    detailsData,
  } = useContext(XenonInspectorContext)!;

  const listRef = useRef<FlatList | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (networkRecords.size) listRef.current?.scrollToEnd();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [networkRecords.size]);

  const renderItem = useCallback<
    ListRenderItem<[NonNullable<ID>, HttpRecord | WebSocketRecord]>
  >(
    ({ item: [_, item] }) => {
      return (
        <NetworkInspectorItem
          name={item.type === NetworkType.WS ? item.uri : item.url}
          status={item.status}
          type={item.type}
          onPress={() => {
            detailsData.current = { network: item };
            setPanelSelected(null);
          }}
        />
      );
    },
    [detailsData, setPanelSelected],
  );

  return (
    <FlatList
      ref={listRef}
      data={Array.from(networkRecords)}
      style={styles.container}
      ListHeaderComponent={NetworkInspectorListHeader}
      stickyHeaderIndices={[0]}
      ItemSeparatorComponent={Separator}
      keyExtractor={([key]) => key}
      renderItem={renderItem}
    />
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
