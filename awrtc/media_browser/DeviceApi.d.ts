export declare class DeviceInfo {
    deviceId: string;
    defaultLabel: string;
    label: string;
    isLabelGuessed: boolean;
}
export interface DeviceApiOnChanged {
    (): void;
}
export declare class DeviceApi {
    private static sLastUpdate;
    static readonly LastUpdate: number;
    static readonly HasInfo: boolean;
    private static sIsPending;
    static readonly IsPending: boolean;
    private static sLastError;
    private static readonly LastError;
    private static sDeviceInfo;
    private static sVideoDeviceCounter;
    private static sAccessStream;
    private static sUpdateEvents;
    static AddOnChangedHandler(evt: DeviceApiOnChanged): void;
    static RemOnChangedHandler(evt: DeviceApiOnChanged): void;
    private static TriggerChangedEvent;
    private static InternalOnEnum;
    static readonly Devices: {
        [id: string]: DeviceInfo;
    };
    static Reset(): void;
    private static InternalOnErrorCatch;
    private static InternalOnErrorString;
    private static InternalOnStream;
    /**Updates the device list based on the current
     * access. Gives the devices numbers if the name isn't known.
     */
    static Update(): void;
    /**Checks if the API is available in the browser.
     * false - browser doesn't support this API
     * true - browser supports the API (might still refuse to give
     * us access later on)
     */
    static IsApiAvailable(): boolean;
    /**Asks the user for access first to get the full
     * device names.
     */
    static RequestUpdate(): void;
    static GetDeviceId(label: string): string;
}
