export const createHttpHeaderLine = (key: string, value: string): string =>
  `${key}: ${value}\n`;

export const getHttpInterceptorId = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 10);
  return timestamp + randomNum;
};

export const createSocketDataLine = (prefix: 'Sent' | 'Received', data: any) =>
  `${prefix}: ${JSON.stringify(data)}\n`;

export const hexToHexAlpha = (hex: string, opacity: number) =>
  `${hex}${`${(Math.min(Math.max(opacity, 0), 1) * 255).toString(16)}0`.slice(
    0,
    2,
  )}`;
