import { useCallback, useContext, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import {
  NetworkType,
  type HttpRecord,
  type ID,
  type WebSocketRecord,
} from '../../../types';
import { hexToHexAlpha } from '../../../utils';
import NetworkInspectorItem from './NetworkInspectorItem';
import NetworkInspectorListHeader from './NetworkInspectorListHeader';
import RelensInspectorContext from '../../contexts/RelensInspectorContext';

const Separator = () => <View style={styles.divider} />;

export default function NetworkInspectorList() {
  const { networkInterceptor: { networkRecords } } = useContext(RelensInspectorContext)!;

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
