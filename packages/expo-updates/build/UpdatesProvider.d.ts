import type { UpdatesInfo } from './Updates.types';
/**
 * Calls [`checkForUpdateAsync`](#checkforupdateasync) and uses the passed in setter
 * to refresh the [`UpdatesInfo`](#updatesinfo). Provided to application code from
 * the [`useUpdates`](#useupdates) hook.
 */
export declare let checkForUpdate: () => void;
/**
 * Downloads and runs an update, if one is available. Provided to application code
 * from the [`useUpdates`](#useupdates) hook.
 */
export declare const runUpdate: () => Promise<void>;
/**
 * Provides the Updates React context. Includes an [`UpdateEvent`](#updateevent) listener
 * that will set the context automatically, if automatic updates are enabled and a new
 * update is available. This is required if application code uses the [`useUpdates`](#useupdates) hook.
 * @param props Context will be provided to `props.children`
 * @returns the provider.
 */
declare const UpdatesProvider: (props: {
    children: any;
}) => JSX.Element;
/**
 * Hook that obtains the Updates info structure and functions. Requires that application code be inside an [`UpdatesProvider`](#updatesprovider).
 * @returns the [`UpdatesInfo`](#updatesinfo) structure, the [`checkForUpdate`](#checkforupdate) function, and the [`runUpdate`](#runupdate) function.
 */
declare const useUpdates: () => {
    updatesInfo: UpdatesInfo;
    checkForUpdate: typeof checkForUpdate;
    runUpdate: typeof runUpdate;
};
export { UpdatesProvider, useUpdates };
//# sourceMappingURL=UpdatesProvider.d.ts.map