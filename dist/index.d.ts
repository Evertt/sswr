import * as svelte_store from 'svelte/store';
import { SWR, SWRKey, SWROptions, SWRMutateOptions, SWRRevalidateOptions, CacheClearOptions } from 'swrev';

/**
 * Exports the extended SWR class with an extra method
 * build for svelte.
 */
declare class SSWR extends SWR {
    /**
     * Svelte specific use of SWR.
     */
    useSvelte<D = any, E = Error>(key: SWRKey | undefined | (() => SWRKey | undefined), options?: Partial<SWROptions<D>>): {
        data: svelte_store.Writable<D | undefined>;
        error: svelte_store.Writable<E | undefined>;
        mutate: (value: D, options: Partial<SWRMutateOptions<D>>) => void;
        revalidate: (options: Partial<SWRRevalidateOptions<D>>) => void;
        clear: (options: Partial<CacheClearOptions>) => void;
        unsubscribe: () => void;
    };
}
/**
 * Creates a mew SWR instance and exports basic methods to
 * work with without the need for method calling.
 */
declare const createSWR: <T = any>(options?: Partial<SWROptions<T>>) => {
    useSWR: <D = T>(key: SWRKey, options?: Partial<SWROptions<D>> | undefined) => {
        data: svelte_store.Writable<D | undefined>;
        error: svelte_store.Writable<Error | undefined>;
        mutate: (value: D, options: Partial<SWRMutateOptions<D>>) => void;
        revalidate: (options: Partial<SWRRevalidateOptions<D>>) => void;
        clear: (options: Partial<CacheClearOptions>) => void;
        unsubscribe: () => void;
    };
    mutate: <D_1 = T>(key: SWRKey, value: D_1, options?: Partial<SWRMutateOptions<D_1>> | undefined) => void;
    revalidate: <D_2 = T>(key: SWRKey, options?: Partial<SWRRevalidateOptions<D_2>> | undefined) => void;
    clear: (keys?: string | string[] | undefined, options?: Partial<CacheClearOptions> | undefined) => void;
};

export { SSWR, createSWR };
