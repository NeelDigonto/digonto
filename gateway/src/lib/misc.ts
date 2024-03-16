export type ID<T extends { id: number }> = T['id'];

export function $<T>(key: keyof T & string) {
  return key;
}

export interface KV {
  key: string;
  value: string;
}

export interface NV {
  name: string;
  value: string;
}
