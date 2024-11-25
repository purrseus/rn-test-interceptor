import { createContext } from 'react';
import type { useLogInterceptor, useNetworkInterceptor } from '../../hooks';
import type {
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
  SetState,
} from '../../types';

interface RelensInspectorContextValue {
  inspectorVisibility: InspectorVisibility;
  setInspectorVisibility: SetState<InspectorVisibility>;
  inspectorPosition: InspectorPosition;
  setInspectorPosition: SetState<InspectorPosition>;
  panelSelected: InspectorPanel;
  setPanelSelected: SetState<InspectorPanel>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  logInterceptor: ReturnType<typeof useLogInterceptor>;
}

const RelensInspectorContext =
  createContext<RelensInspectorContextValue | null>(null);

export default RelensInspectorContext;
