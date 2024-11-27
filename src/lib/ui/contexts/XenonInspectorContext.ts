import { createContext, type MutableRefObject } from 'react';
import type { useLogInterceptor, useNetworkInterceptor } from '../../hooks';
import type {
  HttpRecord,
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
  LogRecord,
  SetState,
  WebSocketRecord,
} from '../../types';

interface XenonInspectorContextValue {
  inspectorVisibility: InspectorVisibility;
  setInspectorVisibility: SetState<InspectorVisibility>;
  inspectorPosition: InspectorPosition;
  setInspectorPosition: SetState<InspectorPosition>;
  panelSelected: InspectorPanel | null;
  setPanelSelected: SetState<InspectorPanel | null>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  logInterceptor: ReturnType<typeof useLogInterceptor>;
  detailsData: MutableRefObject<Partial<
    Record<InspectorPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>;
}

const XenonInspectorContext = createContext<XenonInspectorContextValue | null>(
  null,
);

export default XenonInspectorContext;
