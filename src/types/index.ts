export type CONFIG = {
  // BASE
  port: number;
  isDevelopment: boolean;
  // CORS
  allowedOrigins: string[];
  allowedMethods: string[];
  // LOGGING
  logLevel: string;
  timestampFormat: string;
  // MICROSERVICE
  isMicroservice: boolean;
  microserviceName?: string;
};
