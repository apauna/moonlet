import { WalletEventType, WalletEventData } from 'moonlet-core/src/core/wallet-event-emitter';
import { IResponseData } from '../../utils/response';

export enum ConnectionPort {
    BACKGROUND = 'BACKGROUND',
    POPUP_DETECTION = 'POPUP_DETECTION'
}

export enum BackgroundMessageController {
    WALLET_CONTROLLER = 'WALLET_CONTROLLER',
    LEDGER_HW_CONTROLLER = 'LEDGER_HW_CONTROLLER'
    // REMOTE_INTERFACE = 'REMOTE_INTERFACE'
}

export enum BackgroundMessageType {
    REQUEST = 'REQUEST',
    RESPONSE = 'RESPONSE'
}

export interface IBackgroundMessage {
    id: string;
    type: BackgroundMessageType;
    request: {
        controller: BackgroundMessageController;
        action: string;
        params?: any[];
    };
    response?: IResponseData;
}

export enum ExtensionMessageType {
    WALLET_EVENT = 'WALLET_EVENT',
    OLD_WALLET_DETECTED = 'OLD_WALLET_DETECTED'
}

export interface IExtensionMessage {
    type: ExtensionMessageType;
    data?: { data: WalletEventData; type: WalletEventType };
}
