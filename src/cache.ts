import { CacheItem, SWRKey, DefaultCache, CacheRemoveOptions } from "swrev"

const PREFIX = 'sswr-'

export class SessionCache extends DefaultCache {
  constructor() {
    super()

    const storage = this.storage()
    if (!storage) return

    for (let i = 0; i < storage.length; i++){
      const storageKey = storage.key(i) as string
      const prefix = storageKey.slice(0, PREFIX.length)
      if (prefix !== PREFIX) continue
      const key = storageKey.slice(PREFIX.length)
      const value = storage.getItem(storageKey) as string
      const item = JSON.parse(value) as { data: any, expiresAt: string|null }
      this.elements.set(key, new CacheItem({
        data: item.data, expiresAt: item.expiresAt ? new Date(item.expiresAt) : null
      }))
    }

    setInterval(() => this.purge(), 15000)
  }

  private storage() {
    return typeof window !== 'undefined'
      && 'sessionStorage' in window
      && window.sessionStorage || null
  }

  private purge() {
    this.elements.forEach((cacheItem, key) => {
      if (cacheItem.hasExpired()) {
        this.remove(key, { broadcast: false })
      }
    })
  }

  /**
   * Removes an key-value pair from the cache.
   */
   remove(key: SWRKey, options?: Partial<CacheRemoveOptions>): void {
    super.remove(key, options)
    this.storage()?.removeItem(PREFIX+key)
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
      this.storage()?.setItem(PREFIX+key, JSON.stringify(value))

      // Broadcast the update to all other cache subscriptions.
      this.broadcast(key, detail)
    })
  }
}
