/* eslint-disable @typescript-eslint/no-explicit-any */
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
    barWidth?: number;
    barGap?: number;
    barRadius?: number;
    interact?: boolean;
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
