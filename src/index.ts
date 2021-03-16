import { SWR, SWRKey, SWROptions, SWRMutateOptions, SWRRevalidateOptions, CacheClearOptions } from 'swrev'
import { writable, Writable } from 'svelte/store'
import { SessionCache } from './cache'

/**
 * Exports the extended SWR class with an extra method
 * build for svelte.
 */
export class SSWR extends SWR {
  /**
   * Svelte specific use of SWR.
   */
  useSvelte<D = any, E = Error>(
    key: SWRKey | undefined | (() => SWRKey | undefined),
    options?: Partial<SWROptions<D>>
  ) {
    // Stores the unsubscription handler
    let unsubscribe = () => {}

    // Contains the data and errors stores.
    type Data = Writable<D | undefined> & Promise<D>
    const data = writable<D | undefined>(this.get<D>(this.resolveKey(key)), () => () => unsubscribe()) as Data
    const error = writable<E | undefined>(undefined, () => () => unsubscribe());

    // Handlers that will be executed when data changes.
    const onData = (d: D) => data.set(d)
    const onError = (e: E) => error.set(e)

    // Subscribe and use the SWR fetch using the given key.
    unsubscribe = this.use<D, E>(key, onData, onError, options).unsubscribe

    data.then = (onfulfilled) => {
      return new Promise(resolve => {
        let result: any = undefined
        let unsubscribe = () => {}
        unsubscribe = data.subscribe(payload => {
          if (payload !== undefined) {
            unsubscribe()
            result = payload
            const res = onfulfilled?.(payload)
            resolve(res || (payload as any))
          }
        })
        if (result) unsubscribe()
      })
    }

    // Mutates the current key.
    const mutate = (value: D, options: Partial<SWRMutateOptions<D>>) => {
      return this.mutate(this.resolveKey(key), value, options)
    }

    // Revalidates the current key.
    const revalidate = (options: Partial<SWRRevalidateOptions<D>>) => {
      return this.revalidate(this.resolveKey(key), options)
    }

    // Clears the current key from cache.
    const clear = (options: Partial<CacheClearOptions>) => {
      return this.clear(this.resolveKey(key), options)
    }

    // Return the needed items.
    return {
      data, error, mutate, revalidate, clear, unsubscribe,
      then: (onfulfilled?: ((value: D) => D | PromiseLike<D>) | null | undefined) => {
        data.then(onfulfilled).then(() => unsubscribe())
      }
    }
  }
}

/**
 * Creates a mew SWR instance and exports basic methods to
 * work with without the need for method calling.
 */
export const createSWR = <T = any>(options: Partial<SWROptions<T>> = {}) => {
  const swr = new SSWR({ cache: new SessionCache(), ...options })
  return {
    useSWR: <D = T>(key: SWRKey, options?: Partial<SWROptions<D>>) => swr.useSvelte(key, options),
    mutate: <D = T>(key: SWRKey, value: D, options?: Partial<SWRMutateOptions<D>>) => swr.mutate(key, value, options),
    revalidate: <D = T>(key: SWRKey, options?: Partial<SWRRevalidateOptions<D>>) => swr.revalidate(key, options),
    clear: (keys?: string | string[], options?: Partial<CacheClearOptions>) => swr.clear(keys, options),
  }
}
