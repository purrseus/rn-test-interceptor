import type { NetworkRecord } from './common';

export interface WebSocketRecord extends NetworkRecord {}

export type WebSocketConnectCallback = (() => void) | null;

export type WebSocketSendCallback = (() => void) | null;

export type WebSocketCloseCallback = (() => void) | null;

export type WebSocketOnOpenCallback = (() => void) | null;

export type WebSocketOnMessageCallback = (() => void) | null;

export type WebSocketOnErrorCallback = (() => void) | null;

export type WebSocketOnCloseCallback = (() => void) | null;
