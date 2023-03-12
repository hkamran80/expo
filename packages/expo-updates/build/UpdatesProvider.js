import React, { createContext, useContext, useState } from 'react';
import * as Updates from './Updates';
import { useUpdateEvents } from './UpdatesHooks';
/////// Constants ////////
// The currently running update, constructed from the manifest constant
const currentlyRunning = Updates.manifest;
// True if the app is running from the embedded bundle
const embedded = Updates.isEmbeddedLaunch;
/////// Internal functions ////////
// Promise wrapper for setTimeout()
const delay = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
// Constructs the UpdatesInfo from an event
const updatesFromEvent = (event) => {
    if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
        return {
            currentlyRunning,
            embedded,
        };
    }
    else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        return {
            currentlyRunning,
            updateAvailable: event.manifest,
            embedded,
        };
    }
    else {
        // event type === ERROR
        return {
            currentlyRunning,
            error: event.message || '',
            embedded,
        };
    }
};
// Implementation of checkForUpdate
const checkAndRefreshUpdatesStructure = async (setUpdates) => {
    let result;
    try {
        const checkResult = await Updates.checkForUpdateAsync();
        if (checkResult.isAvailable) {
            result = {
                currentlyRunning,
                updateAvailable: checkResult.manifest,
                embedded,
            };
        }
        else {
            result = {
                currentlyRunning,
                embedded,
            };
        }
    }
    catch (error) {
        result = {
            currentlyRunning,
            error: error?.message || 'Error occurred',
            embedded,
        };
    }
    setUpdates(result);
};
// The context provided to the app
const UpdatesContext = createContext({
    updatesInfo: {
        currentlyRunning,
        embedded,
    },
    setUpdatesInfo: (_) => { },
});
///////////// Exported functions /////////////
/**
 * Calls [`checkForUpdateAsync`](#checkforupdateasync) and uses the passed in setter
 * to refresh the [`UpdatesInfo`](#updatesinfo). Provided to application code from
 * the [`useUpdates`](#useupdates) hook.
 */
export let checkForUpdate = () => {
    // This stub is replaced with the real implementation in the hook
};
/**
 * Downloads and runs an update, if one is available. Provided to application code
 * from the [`useUpdates`](#useupdates) hook.
 */
export const runUpdate = async () => {
    await Updates.fetchUpdateAsync();
    await delay(2000);
    await Updates.reloadAsync();
};
/**
 * Provides the Updates React context. Includes an [`UpdateEvent`](#updateevent) listener
 * that will set the context automatically, if automatic updates are enabled and a new
 * update is available. This is required if application code uses the [`useUpdates`](#useupdates) hook.
 * @param props Context will be provided to `props.children`
 * @returns the provider.
 */
const UpdatesProvider = (props) => {
    const [updatesInfo, setUpdatesInfo] = useState({
        currentlyRunning,
        embedded,
    });
    // Set up listener for events from automatic update requests
    // that happen on startup, and use events to refresh the updates info
    // context
    useUpdateEvents((event) => {
        setUpdatesInfo(updatesFromEvent(event));
    });
    return (React.createElement(UpdatesContext.Provider, { value: { updatesInfo, setUpdatesInfo } }, props.children));
};
/**
 * Hook that obtains the Updates info structure and functions. Requires that application code be inside an [`UpdatesProvider`](#updatesprovider).
 * @returns the [`UpdatesInfo`](#updatesinfo) structure, the [`checkForUpdate`](#checkforupdate) function, and the [`runUpdate`](#runupdate) function.
 */
const useUpdates = () => {
    // Get updates info value and setter from provider
    const { updatesInfo, setUpdatesInfo } = useContext(UpdatesContext);
    // Create the implementation of checkForUpdate()
    checkForUpdate = () => {
        checkAndRefreshUpdatesStructure(setUpdatesInfo);
    };
    // Return the updates info and the user facing functions
    return { updatesInfo, checkForUpdate, runUpdate };
};
export { UpdatesProvider, useUpdates };
//# sourceMappingURL=UpdatesProvider.js.map