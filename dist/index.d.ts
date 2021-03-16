import { SWR, SWRKey, SWROptions, SWRMutateOptions, SWRRevalidateOptions, CacheClearOptions } from 'swrev';
import { Writable } from 'svelte/store';

/**
 * Exports the extended SWR class with an extra method
 * build for svelte.
 */
declare class SSWR extends SWR {
    /**
     * Svelte specific use of SWR.
     */
    useSvelte<D = any, E = Error>(key: SWRKey | undefined | (() => SWRKey | undefined), options?: Partial<SWROptions<D>>): {
        data: Writable<D | undefined> & Promise<D>;
        error: Writable<E | undefined>;
        mutate: (value: D, options: Partial<SWRMutateOptions<D>>) => void;
        revalidate: (options: Partial<SWRRevalidateOptions<D>>) => void;
        clear: (options: Partial<CacheClearOptions>) => void;
        unsubscribe: () => void;
        then: (onfulfilled?: ((value: D) => D | PromiseLike<D>) | null | undefined) => void;
    };
}
/**
 * Creates a mew SWR instance and exports basic methods to
 * work with without the need for method calling.
 */
declare const createSWR: <T = any>(options?: Partial<SWROptions<T>>) => {
    useSWR: <D = T>(key: SWRKey, options?: Partial<SWROptions<D>> | undefined) => {
        data: Writable<D | undefined> & Promise<D>;
        error: Writable<Error | undefined>;
        mutate: (value: D, options: Partial<SWRMutateOptions<D>>) => void;
        revalidate: (options: Partial<SWRRevalidateOptions<D>>) => void;
        clear: (options: Partial<CacheClearOptions>) => void;
        unsubscribe: () => void;
        then: (onfulfilled?: ((value: D) => D | PromiseLike<D>) | null | undefined) => void;
    };
    mutate: <D_2 = T>(key: SWRKey, value: D_2, options?: Partial<SWRMutateOptions<D_2>> | undefined) => void;
    revalidate: <D_3 = T>(key: SWRKey, options?: Partial<SWRRevalidateOptions<D_3>> | undefined) => void;
    clear: (keys?: string | string[] | undefined, options?: Partial<CacheClearOptions> | undefined) => void;
};

export { SSWR, createSWR };
