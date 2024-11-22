import { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import {
  NetworkType,
  type HttpRecord,
  type ID,
  type NetworkRecords,
  type WebSocketRecord,
} from '../../../types';
import NetworkInspectorItem from './NetworkInspectorItem';
import NetworkInspectorListHeader from './NetworkInspectorListHeader';
import { hexToHexAlpha } from '../../../utils';

interface NetworkInspectorListProps {
  data: NetworkRecords<HttpRecord | WebSocketRecord>;
}

const Separator = () => <View style={styles.divider} />;

export default function NetworkInspectorList({
  data,
}: NetworkInspectorListProps) {
  const listRef = useRef<FlatList | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (data.size) listRef.current?.scrollToEnd();
    }, 0);
  }, [data.size]);

  const renderItem = useCallback<
    ListRenderItem<[NonNullable<ID>, HttpRecord | WebSocketRecord]>
  >(({ item: [_, item] }) => {
    return (
      <NetworkInspectorItem
        name={item.type === NetworkType.WS ? item.uri : item.url}
        status={item.status}
        type={item.type}
      />
    );
  }, []);

  return (
    <FlatList
      ref={listRef}
      data={Array.from(data)}
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
    margin: 8,
  },
  divider: {
    height: 1,
    backgroundColor: hexToHexAlpha('#000000', 0.25),
  },
});
