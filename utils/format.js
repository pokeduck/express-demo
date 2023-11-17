/**
 *
 * @param {Error} error
 * @returns {JSON}
 */
export function formatErrorToJSON(error) {
  const { name, message, stack } = error;
  return JSON.stringify({ name, message, stack });
}
