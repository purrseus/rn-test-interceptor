import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

export const createHttpHeaderLine = (key: string, value: string): string =>
  `${key}: ${value}\n`;

export const getHttpInterceptorId = () => nanoid();

export const createSocketDataLine = (prefix: 'Sent' | 'Received', data: any) =>
  `${prefix}: ${JSON.stringify(data)}\n`;
