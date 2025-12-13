// DOTENV
import { config } from 'dotenv';
// DATE-FNS
import { formatISO } from 'date-fns';

config();

export const PORT = process.env.PORT || 1337;

export const TIMESTAMP = formatISO(new Date());

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' ? false : true;