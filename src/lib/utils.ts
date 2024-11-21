import 'react-native-get-random-values';

import { nanoid } from 'nanoid';

export const createHeaderLine = (key: string, value: string): string =>
  `${key}: ${value}\n`;

export const getInterceptorId = () => nanoid();
