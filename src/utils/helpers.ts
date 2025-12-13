// CONFIG
import config from 'config';
// TYPES
import { Config } from '@/types';

export function getConfig<T>(key: keyof Config): T {
  return config.get<T>(key as string);
}
