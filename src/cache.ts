import { CacheItem, SWRKey, DefaultCache, CacheRemoveOptions } from "swrev"

export class SessionCache extends DefaultCache {
  constructor() {
    super()
    if (typeof window === 'undefined') return

    for (let i = 0; i < window.sessionStorage.length; i++){
      const key = window.sessionStorage.key(i) as string
      const memKey = key.replace(/^sswr-/, '')
      if (key === memKey) continue;
      const value = window.sessionStorage.getItem(key) as string
      const item = JSON.parse(value) as { data: any, expiresAt: string|null }
      this.elements.set(memKey, new CacheItem({
        data: item.data, expiresAt: item.expiresAt ? new Date(item.expiresAt) : null
      }))
    }

    setInterval(() => this.purge(), 15000)
  }

  private purge() {
    for (let i = 0; i < window.sessionStorage.length; i++){
      const key = window.sessionStorage.key(i) as string
      const memKey = key.replace(/^sswr-/, '')
      if (key === memKey) continue
      const value = window.sessionStorage.getItem(key) as string
      const item = JSON.parse(value) as { data: any, expiresAt: string|null }
      if (!item.expiresAt) continue
      const expiresAt = new Date(item.expiresAt)
      if (expiresAt.getTime() >= new Date().getTime()) continue
      this.remove(memKey, { broadcast: false })
    }
  }

  /**
   * Removes an key-value pair from the cache.
   */
   remove(key: SWRKey, options?: Partial<CacheRemoveOptions>): void {
    super.remove(key, options)
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(`sswr-${key}`)
    }
  }

  /**
   * Resolves the promise and replaces the Promise to the resolved data.
   * It also broadcasts the value change if needed or deletes the key if
   * the value resolves to undefined or null.
   */
  protected resolve<D>(key: SWRKey, value: CacheItem<D>) {
    Promise.resolve(value.data).then((detail) => {
      if (detail === undefined || detail === null) {
        // The value resolved to undefined, and we delete
        // it from the cache and don't broadcast any event.
        return this.remove(key)
      }
      // Update the value with the resolved one.
      value.data = detail

      // Store in sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(`sswr-${key}`, JSON.stringify(value))
      }

      // Broadcast the update to all other cache subscriptions.
      this.broadcast(key, detail)
    })
  }
}
