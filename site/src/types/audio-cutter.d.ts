declare module "wavesurfer.js" {
  type WaveSurferOptions = {
    container: HTMLElement;
    waveColor?: string;
    progressColor?: string;
    cursorColor?: string;
    cursorWidth?: number;
    height?: number;
    normalize?: boolean;
    autoScroll?: boolean;
    minPxPerSec?: number;
  };

  export default class WaveSurfer {
    static create(options: WaveSurferOptions): WaveSurfer;

    load(url: string): void;
    destroy(): void;
    registerPlugin<T>(plugin: T): T;

    on(event: string, cb: (...args: any[]) => void): void;

    getDuration(): number;
    setTime(timeSec: number): void;

    playPause(): void;
    isPlaying(): boolean;

    setOptions(opts: Partial<WaveSurferOptions>): void;
  }
}

declare module "wavesurfer.js/dist/plugins/regions.esm.js" {
  const RegionsPlugin: {
    create: (opts?: any) => any;
  };
  export default RegionsPlugin;
}

declare module "lamejs" {
  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Uint8Array;
    flush(): Uint8Array;
  }
}
