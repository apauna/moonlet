import { h } from 'preact';
import { Provider } from 'preact-redux';
import App from '../../app/app.container';
import { getStore } from '../../app/data';
import { DeviceScreenSize, Platform } from '../../app/types';
import { getScreenSizeMatchMedia } from '../../app/utils/screen-size-match-media';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { WalletPlugin } from '../../plugins/wallet/web';
import { createWalletLoaded } from '../../app/data/wallet/actions';
import { IUserPreferences } from '../../app/data/user-preferences/state';
import { createUpdateConversionRates } from '../../app/data/currency/actions';
import { getSwitchNetworkConfig } from '../../utils/blockchain/utils';
import { WalletStatus } from '../../app/data/wallet/state';
import { IPlugins } from '../../plugins/iplugins';
import { LedgerHwPlugin } from '../../plugins/ledger-hw/web';

const loadState = (): IUserPreferences => {
    const defaults = {
        preferredCurrency: 'USD',
        devMode: false,
        testNet: false,
        networks: {}
    };

    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return defaults;
        }
        return { ...defaults, ...JSON.parse(serializedState) };
    } catch (err) {
        return defaults;
    }
};

const saveState = state => {
    try {
        const serializedState = JSON.stringify(state.userPreferences);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};

const store = getStore({
    pageConfig: {
        device: {
            screenSize: getScreenSizeMatchMedia().matches
                ? DeviceScreenSize.SMALL
                : DeviceScreenSize.BIG,
            platform: Platform.WEB
        },
        layout: {}
    },
    wallet: {
        invalidPassword: false,
        status: WalletStatus.LOADING,
        data: {
            accounts: []
        }
    },
    userPreferences: loadState()
});

store.subscribe(() => saveState(store.getState()));

const ledgerPlugin = new LedgerHwPlugin();
const plugins: IPlugins = {
    wallet: new WalletPlugin(ledgerPlugin),
    ledgerHw: new LedgerHwPlugin()
};

(async () => {
    await plugins.wallet.createWallet(
        'gadget clean certain tiger abandon prevent light pluck muscle obtain mobile agree',
        // 'whisper put since april sadness orbit engage boy awesome ability like try',
        'asd'
    );
    plugins.wallet.switchNetwork(
        getSwitchNetworkConfig(
            store.getState().userPreferences.testNet,
            store.getState().userPreferences.networks
        )
    );
    await plugins.wallet.createAccount(Blockchain.ZILLIQA, 1);
    await plugins.wallet.createAccount(Blockchain.ETHEREUM, 1);

    // get multiple addresses from HW using a range of accountIds and derivationIds
    // const hw = new HardwareWalletEthereum();
    // Ok but sloooow
    // hw.getAddressesInRange(0,0,0,50);

    // timeout problems from u2f for creating too many transports !!!!!
    // for (var di=0; di<50; di++){
    //     const addressPromise = hw.getAddress(0, di);
    //     addressPromise.then(function(address){
    //         console.log("addr for index " + di + " is " + address);
    //     }
    //     );
    // }

    // await plugins.wallet.importHWAccount(Blockchain.ETHEREUM, 'ethhw1', 0, 0);
    // console.log(await plugins.wallet.getAccounts({ ZILLIQA: 2 }));
    store.dispatch(createWalletLoaded(WalletStatus.UNLOCKED, await plugins.wallet.getWallet()));

    // store.dispatch(createLoadWallet(plugins.wallet, {
    //     testNet: loadState().testNet,
    //     networks: {}
    // }) as any);

    store.dispatch(createUpdateConversionRates() as any);
    setInterval(() => store.dispatch(createUpdateConversionRates() as any), 5 * 60 * 1000);
})();

export default props => (
    <Provider store={store}>
        <App {...props} plugins={plugins} />
    </Provider>
);
