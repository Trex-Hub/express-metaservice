// DATE-FNS
import { formatISO } from 'date-fns';
// CONFIG
import { getConfig } from '@/utils/helpers';

export const PORT = getConfig<number>('port');
export const TIMESTAMP = formatISO(new Date());
export const IS_DEVELOPMENT = getConfig<boolean>('isDevelopment');