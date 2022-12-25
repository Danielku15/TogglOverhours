import { Injectable } from '@angular/core';

export interface IFileSystemFileHandle {
  readonly name: string;
  loadText(): Promise<string>;
  writeText(text: string): Promise<void>;
  serialize(): string;
}

export abstract class IFileSystemService {
  public abstract showOpenFilePicker(
    fileId: string,
    options: OpenFilePickerOptions
  ): Promise<IFileSystemFileHandle | undefined>;
  public abstract showSaveFilePicker(
    fileId: string,
    options: SaveFilePickerOptions
  ): Promise<IFileSystemFileHandle>;

  public abstract constructHandle(
    serialized: string | null
  ): Promise<IFileSystemFileHandle | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class BrowserFileSystemService implements IFileSystemService {
  constructor() {}

  public async showOpenFilePicker(
    fileId: string,
    options: OpenFilePickerOptions
  ): Promise<IFileSystemFileHandle | undefined> {
    const [fileHandle] = await showOpenFilePicker({
      ...options,
      multiple: false,
    });

    if (fileHandle?.kind === 'file') {
      return new BrowserFileSystemFileHandle(fileHandle);
    } else {
      return undefined;
    }
  }

  public async constructHandle(
    serialized: any
  ): Promise<IFileSystemFileHandle | undefined> {
    // not supported to serialize/deserialize handles because
    // browser permission handling is too sensitive when accessing files
    // to provide this feature
    return undefined;
  }

  async showSaveFilePicker(
    fileId: string,
    options: SaveFilePickerOptions
  ): Promise<IFileSystemFileHandle> {
    return new BrowserFileSystemFileHandle(
      await window.showSaveFilePicker(options)
    );
  }
}

export class BrowserFileSystemFileHandle implements IFileSystemFileHandle {
  public constructor(private handle: FileSystemFileHandle) {}

  public get name(): string {
    return this.handle.name;
  }

  async loadText(): Promise<string> {
    let permission = await this.handle.queryPermission();
    if (permission == 'denied') {
      throw new Error('No permission to open file');
    } else if (permission == 'prompt') {
      permission = await this.handle.requestPermission({
        mode: 'readwrite',
      });
    } else {
      // OK
    }

    if (permission != 'granted') {
      throw new Error('No permission to open file');
    }

    const fileData = await this.handle.getFile();
    return await fileData.text();
  }

  async writeText(text: string): Promise<void> {
    const writable = await this.handle.createWritable({
      keepExistingData: false,
    });
    try {
      writable.write(text);
    } finally {
      writable.close();
    }
  }

  serialize(): string {
    if ('serialize' in this.handle) {
      return (this.handle as any).serialize();
    }
    return '';
  }
}

const testStorage = sessionStorage;

@Injectable({
  providedIn: 'root',
})
export class TestFileSystemService implements IFileSystemService {
  private files: Map<string, TestBrowserFile> = new Map();

  constructor() {}

  public async showOpenFilePicker(
    fileId: string
  ): Promise<IFileSystemFileHandle | undefined> {
    let file = this.files.get(fileId);

    if (!file) {
      file = new TestBrowserFile(fileId);
      this.files.set(fileId, file);
    }

    return new BrowserFileSystemFileHandle(
      new TestBrowserFileSystemFileHandle(file)
    );
  }

  public async constructHandle(
    serialized: any
  ): Promise<IFileSystemFileHandle | undefined> {
    if (typeof serialized !== 'string') {
      return undefined;
    }
    return await this.showOpenFilePicker(serialized);
  }

  async showSaveFilePicker(
    fileId: string,
    options: SaveFilePickerOptions
  ): Promise<IFileSystemFileHandle> {
    let file = this.files.get(fileId);
    if (!file) {
      file = new TestBrowserFile(fileId);
      this.files.set(fileId, file);
    }

    return new BrowserFileSystemFileHandle(
      new TestBrowserFileSystemFileHandle(file)
    );
  }
}

class TestBrowserFile implements File {
  public name: string;
  public data: ArrayBuffer;

  public constructor(fileId: string) {
    this.name = fileId;
    const fileData = testStorage.getItem(`toggle-overhours.files.${fileId}`);
    if (fileData) {
      var binaryString = window.atob(fileData);
      var bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      this.data = bytes.buffer;
    } else {
      this.data = new ArrayBuffer(0);
    }
  }

  createWritable(
    options: FileSystemCreateWritableOptions | undefined
  ): Promise<FileSystemWritableFileStream> {
    // data for writable
    const chunks: Uint8Array[] = [];
    const encoder = new TextEncoder();
    function addChunk(data: any) {
      let chunk: Uint8Array;
      if (typeof data == 'string') {
        chunk = encoder.encode(data);
      } else {
        throw new Error('not supported');
      }

      chunks.push(chunk);
      totalSize += data.length;
    }

    let totalSize = 0;
    if (options?.keepExistingData == true) {
      chunks.push(new Uint8Array(this.data));
      totalSize = this.data.byteLength;
    }

    const target = this;

    // actual writable which will flush down.
    const writable = new WritableStream({
      write(chunk) {
        addChunk(chunk);
      },
      close() {
        const result = new Uint8Array(totalSize);
        let i = 0;
        for (const chunk of chunks) {
          result.set(chunk, i);
          i += chunk.byteLength;
        }
        target.data = result.buffer;

        testStorage.setItem(
          `toggle-overhours.files.${target.name}`,
          btoa(String.fromCharCode(...result))
        );
      },
    });

    (writable as any).write = async (
      data: FileSystemWriteChunkType
    ): Promise<void> => {
      addChunk(data);
    };

    (writable as any).seek = async (): Promise<void> => {
      throw new Error('not supported');
    };

    (writable as any).truncate = async (size: number): Promise<void> => {
      throw new Error('not supported');
    };

    return writable as any;
  }

  public lastModified: number = new Date().getTime();

  public get webkitRelativePath(): string {
    return this.name;
  }

  public get size(): number {
    return this.data.byteLength;
  }

  public readonly type: string = 'application/octet-stream';

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.data;
  }

  slice(
    start?: number | undefined,
    end?: number | undefined,
    contentType?: string | undefined
  ): Blob {
    return new Blob([this.data.slice(start ?? 0, end)], {
      type: contentType,
    });
  }

  stream(): ReadableStream<Uint8Array> {
    const data = this.data;
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(data));
        controller.close();
      },
    });
  }

  async text(): Promise<string> {
    const dec = new TextDecoder();
    return dec.decode(this.data);
  }
}

class TestBrowserFileSystemFileHandle implements FileSystemFileHandle {
  public readonly kind = 'file';
  public readonly isFile = true;
  public readonly isDirectory = false;
  public get name(): string {
    return this.file.name;
  }

  public constructor(private file: TestBrowserFile) {}

  public async getFile(): Promise<File> {
    return this.file;
  }

  public async queryPermission(): Promise<PermissionState> {
    return 'granted';
  }

  public async requestPermission(): Promise<PermissionState> {
    return 'granted';
  }

  public createWritable(
    options?: FileSystemCreateWritableOptions
  ): Promise<FileSystemWritableFileStream> {
    return this.file.createWritable(options);
  }

  async loadText(): Promise<string> {
    return await this.file.text();
  }

  public async isSameEntry(other: FileSystemHandle): Promise<boolean> {
    if (other instanceof TestBrowserFileSystemFileHandle) {
      return other.file.name == this.file.name;
    }
    return false;
  }

  public serialize(): string {
    return this.file.name;
  }
}
