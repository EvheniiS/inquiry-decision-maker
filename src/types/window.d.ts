interface Window {
  fs: {
    readFile: (path: string) => Promise<Uint8Array>;
  }
} 