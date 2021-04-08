import { Platform } from 'react-native';

export const iosAdUnitID = "ca-app-pub-6025972467008506/7928690789"
export const androidAdUnitID = "ca-app-pub-6025972467008506/7627319756"
export const adUnitID = () => {
    return Platform.OS == 'ios' ? iosAdUnitID : androidAdUnitID
}