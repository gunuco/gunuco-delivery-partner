// Web/SSR: return the client value immediately in the browser bundle.
export function useClientOnlyValue<S, C>(_server: S, client: C): S | C {
  return client;
}
