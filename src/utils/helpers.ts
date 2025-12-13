// CONFIG
import config from 'config';
// TYPES
import { CONFIG } from '@/types';

export function getConfig<T>(key: keyof CONFIG): T {
  return config.get<T>(key);
}
