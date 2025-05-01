// global.d.ts
interface NDEFRecord {
  recordType: string;
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
  data?: any;
}

interface NDEFMessage {
  records: NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  serialNumber: string;
  message: NDEFMessage;
}

interface NDEFReader extends EventTarget {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(
    message: NDEFMessage | string,
    options?: { signal?: AbortSignal; overwrite?: boolean }
  ): Promise<void>;
  addEventListener(
    type: 'reading',
    listener: (this: NDEFReader, ev: NDEFReadingEvent) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'readingerror',
    listener: (this: NDEFReader, ev: Event) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

interface NDEFReaderConstructor {
  new (): NDEFReader;
}

declare global {
  interface Window {
    NDEFReader: NDEFReaderConstructor;
  }
}

export {};
