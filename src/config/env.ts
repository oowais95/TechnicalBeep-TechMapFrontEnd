const trimSlash = (value: string) => value.replace(/\/+$/, '')
const parseBool = (value: string | undefined) => value === 'true'

export const ENV = {
  apiBaseUrl: trimSlash(import.meta.env.VITE_API_BASE_URL ?? ''),
  useMockApi: parseBool(import.meta.env.VITE_USE_MOCK_API) || !import.meta.env.VITE_API_BASE_URL,
}
