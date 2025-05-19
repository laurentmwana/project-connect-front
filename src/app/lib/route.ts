import { Environment } from "environments/environment"

const API_ROUTES = {
  "login" : "/login",
}


type RouteParams = Record<string, string | number | boolean | null>

function resolveRoute<T extends Record<keyof T, string>>(
  routes: T,
  key: keyof T,
  params?: RouteParams
): string {
  const route = routes[key]

  if (!route) {
    throw new Error(`Route introuvable : ${String(key)}`)
  }

  let resolvedRoute = route.toString()
  const queryParams: Record<string, string> = {}

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      const pattern = `:${paramKey}`

      if (resolvedRoute.includes(pattern)) {
        resolvedRoute = resolvedRoute.replace(
          new RegExp(`:${paramKey}\\b`, 'g'),
          encodeURIComponent(String(paramValue))
        )
      } else {
        queryParams[paramKey] = String(paramValue)
      }
    }
  }

  const missingParams = resolvedRoute.match(/:([a-zA-Z0-9_]+)/g)
  if (missingParams) {
    throw new Error(
      `Paramètres manquants dans la route ${String(key)} : ${missingParams.join(
        ', '
      )}`
    )
  }

  const queryString =
    Object.keys(queryParams).length > 0
      ? `?${new URLSearchParams(queryParams).toString()}`
      : ''

  return `${resolvedRoute}${queryString}`
}


export const apiRoute = (
  key: keyof typeof API_ROUTES,
  params?: RouteParams
): string => {
  const baseUrl = Environment.apiUrl

  if (!baseUrl)
    throw new Error('Base Url do not exist')
  return baseUrl + resolveRoute(API_ROUTES, key, params)
}