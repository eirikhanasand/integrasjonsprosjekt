declare module 'three/examples/jsm/loaders/FBXLoader.js' {
    import { Loader } from 'three';
    export class FBXLoader extends Loader {
      load(
        url: string,
        onLoad: (object: any) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
    }
  }
  