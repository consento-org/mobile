import React, { DependencyList, useEffect } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'
import { BackHandler } from 'react-native'
import { exists } from '../styles/util/lang'

export { NavigationContainer } from '@react-navigation/native'

export function createNavRef (): React.RefObject<NavigationContainerRef> {
  return React.createRef<NavigationContainerRef>()
}

export const navigationRef = createNavRef()

export interface IRoute <TParams = any> {
  screen: string
  params?: IRoute<TParams> | TParams
}

export type TBackHandler <TArgs> = (string | undefined | ((args: TArgs) => true | false | string | void | undefined | null))

export function useBackHandler <TDeps extends DependencyList = []> (back: TBackHandler<TDeps>, { deps, active }: { deps?: TDeps, active?: boolean } = {}): () => boolean {
  const finalDeps = deps ?? ([] as unknown as TDeps)
  const handleBack = (): boolean => {
    if (!exists(back)) {
      return false
    }
    if (typeof back === 'string') {
      navigate(back)
    } else {
      const result = back(finalDeps)
      if (typeof result === 'string') {
        navigate(result)
      }
      if (result === true || result === false) {
        return result
      }
    }
    return true
  }
  useEffect(() => {
    if (active !== undefined && !active) {
      return
    }
    BackHandler.addEventListener('hardwareBackPress', handleBack)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack)
    }
  }, finalDeps)
  return handleBack
}

function routeFromArray <TParams = any> (route: string[], params: TParams): IRoute<TParams> {
  const firstRoute = route.shift()
  if (firstRoute === undefined) {
    throw new Error('Empty route array received')
  }
  const root: IRoute<TParams> = {
    screen: firstRoute
  }
  let current = root
  for (const segment of route) {
    const next = {
      screen: segment
    }
    current.params = next
    current = next
  }
  current.params = params
  return root
}

export interface INavigate <TParams = any> {
  /**
   * Navigate to route as described in the react-navigation documentation
   *
   * @see https://reactnavigation.org/docs/navigating-without-navigation-prop
   */
  (route: string, params?: TParams): void

  /**
   * Navigate to deep route with a set of strings instead of a route
   */
  (routes: string[], params?: TParams): void

  /**
   * Deep route navigation with a single object, useful if you want to pass around routes, mostly an implementation detail
   */
  (route: IRoute<TParams>): void
}

/**
 * Navigation with support for deep links
 *
 * This expands upon the documented use of `navigate` that adds support for deep routes with objects and
 * with an array of routes.
 *
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop
 * @see https://reactnavigation.org/docs/nesting-navigators/#navigating-to-a-screen-in-a-nested-navigator
 */
export const navigate: INavigate = <TParams = any> (route: string | string[] | IRoute<TParams>, params?: any) => {
  if (Array.isArray(route)) {
    route = routeFromArray(route, params)
    return navigate(route.screen, route.params)
  }
  if (typeof route !== 'string') {
    return navigate(route.screen, route.params)
  }
  navigationRef.current?.navigate(route, params)
}

export function canGoBack (): boolean {
  return navigationRef.current?.canGoBack() ?? false
}

export function goBack (): void {
  navigationRef.current?.goBack()
}
