/**
 * Environment-gated console wrapper.
 *
 * Vite statically replaces `import.meta.env.*` at build time, so in a
 * production build the `isLoggingEnabled` check folds to `false` and the
 * bundler can drop the call bodies.
 *
 * Enabled when either:
 *   - running the dev server (`npm run dev`), or
 *   - `VITE_ENABLE_LOGS=true` is set — lets you turn logging on for a
 *     deployed build (e.g. debugging on Vercel) without a code change.
 *
 * `error` is intentionally always on: production errors are worth surfacing
 * and are usually the only signal available when diagnosing a live issue.
 */

export const isLoggingEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOGS === "true";

const noop = () => {};

export const logger = {
  log: isLoggingEnabled ? console.log.bind(console) : noop,
  info: isLoggingEnabled ? console.info.bind(console) : noop,
  debug: isLoggingEnabled ? console.debug.bind(console) : noop,
  warn: isLoggingEnabled ? console.warn.bind(console) : noop,
  table: isLoggingEnabled ? console.table.bind(console) : noop,

  // Always reported, in every environment.
  error: console.error.bind(console),
};

export default logger;
