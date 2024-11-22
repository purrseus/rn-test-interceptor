import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

export const createHttpHeaderLine = (key: string, value: string): string =>
  `${key}: ${value}\n`;

export const getHttpInterceptorId = () => nanoid();

export const createSocketDataLine = (prefix: 'Sent' | 'Received', data: any) =>
  `${prefix}: ${JSON.stringify(data)}\n`;

export const hexToHexAlpha = (hex: string, opacity: number) =>
  `${hex}${`${(Math.min(Math.max(opacity, 0), 1) * 255).toString(16)}0`.slice(
    0,
    2,
  )}`;
