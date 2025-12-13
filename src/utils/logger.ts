const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  log: (message?: any, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.log(message, ...optionalParams);
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    console.error(message, ...optionalParams);
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.warn(message, ...optionalParams);
    }
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (!isProduction) {
      console.info(message, ...optionalParams);
    }
  },
};

export default logger;
