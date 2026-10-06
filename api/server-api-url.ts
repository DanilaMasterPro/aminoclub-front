/**
 * API base for server-side rendering. On the server Next calls the backend directly
 * (API_INTERNAL_URL, e.g. http://127.0.0.1:4210/api) so SSR traffic is not counted against the
 * public rate limit of a single IP; in the browser the variable is undefined and the public URL is used.
 */
export const serverApiUrl = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
