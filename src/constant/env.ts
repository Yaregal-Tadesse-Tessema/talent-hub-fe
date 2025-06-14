export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';
export const isLocal = process.env.NEXT_PUBLIC_ENV === 'local';

// Only show logger in development or if explicitly enabled
export const showLogger =
  isDev || (isLocal && process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true');

// Disable development tools in production
export const showDevTools =
  isDev || (isLocal && process.env.NEXT_PUBLIC_SHOW_DEV_TOOLS === 'true');
