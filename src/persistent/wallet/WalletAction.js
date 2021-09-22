import {WalletService} from './WalletService';
import {
    addWalletSuccess,
    getTransactionsSuccess,
    getWalletsSuccess,
    setActiveWalletSuccess,
    setRawActiveWalletSuccess,
} from './WalletReducer';
import WalletModule from '../../module/etherjs/WalletModule';
import {LMStorageService} from '../storage/LMStorageService';
import {LMStorageConstant} from '../storage/LMStorageConstant';
import {TokenAction} from '../token/TokenAction';
import {AssetAction} from '../asset/AssetAction';

export const WalletAction = {
    addFromMnemonic,
    addFromPrivateKey,
    setActiveWallet,
    getActiveWallet,
    sendTransaction,
    getWallets,
    getTransactions,
};

function addFromMnemonic({mnemonics, name, isMain}) {
    return async dispatch => {
        const {success, data} = await WalletService.fromMnemonic(mnemonics);
        if (success) {
            const wallet = {
                name,
                isMain,
                privateKey: data.privateKey,
                address: data.address,
                balance: await WalletModule.getBalance(data),
            };
            dispatch(addWalletSuccess(wallet));
            dispatch(setActiveWalletSuccess(wallet));
            dispatch(setRawActiveWalletSuccess(data));
            dispatch(getTransactions(data.address));
            await LMStorageService.setItem(LMStorageConstant.ACTIVE_WALLET_STORAGE_KEY, wallet);
            await setWallets(wallet);
        }
        return {success, data};
    };
}

async function setWallets(wallet) {
    const wallets = await LMStorageService.getItem(LMStorageConstant.WALLETS_STORAGE_KEY) || [];
    wallets.push(wallet);
    await LMStorageService.setItem(LMStorageConstant.WALLETS_STORAGE_KEY, wallets);
}

function addFromPrivateKey({privateKey, name}) {
    return async dispatch => {
        const {success, data} = await WalletService.fromPrivateKey(privateKey);
        if (success) {
            const wallet = {
                name,
                privateKey: data.privateKey,
                address: data.address,
                balance: await WalletModule.getBalance(data),
            };
            dispatch(addWalletSuccess(wallet));
            await setWallets(wallet);
        }
        return {success, data};
    };
}

function setActiveWallet({privateKey, name,chainId}) {
    return async dispatch => {
        const {success, data} = await WalletService.fromPrivateKey(privateKey);
        const wallet = {
            name,
            privateKey: data.privateKey,
            address: data.address,
            balance: await WalletModule.getBalance(data),
        };
        if (success) {
            dispatch(setActiveWalletSuccess(wallet));
            dispatch(setRawActiveWalletSuccess(data));
            dispatch(getTransactions(data.address));
            await LMStorageService.setItem(LMStorageConstant.ACTIVE_WALLET_STORAGE_KEY, wallet);
            dispatch(AssetAction.list(data.address,chainId));
        }
        return {success, data};
    };
}

function getActiveWallet() {
    return async dispatch => {
        const {privateKey, name} = await LMStorageService.getItem(LMStorageConstant.ACTIVE_WALLET_STORAGE_KEY);
        const {success, data} = await WalletService.fromPrivateKey(privateKey);
        const wallet = {
            name,
            privateKey: data.privateKey,
            address: data.address,
            balance: await WalletModule.getBalance(data),
        };
        if (success) {
            dispatch(setActiveWalletSuccess(wallet));
            dispatch(setRawActiveWalletSuccess(data));
            dispatch(getTransactions(data.address));
        }
        return {success, data};
    };
}

function getWallets() {
    return async dispatch => {
        const wallets = await LMStorageService.getItem(LMStorageConstant.WALLETS_STORAGE_KEY) || [];
        const activeWallets = [];
        for (let i = 0; i < wallets.length; i++) {
            const wallet = wallets[i];
            const {data} = await WalletService.fromPrivateKey(wallet.privateKey);
            const activeWallet = {
                ...wallet,
                balance: await WalletModule.getBalance(data),
            };
            activeWallets.push(activeWallet);
        }
        dispatch(getWalletsSuccess(activeWallets));
    };
}

function sendTransaction(wallet, tx) {
    return async dispatch => {
        const {success, data} = await WalletService.sendTransaction(wallet, tx);
        if (success) {
            await wallet.provider.waitForTransaction(data.hash);
            dispatch(setActiveWalletSuccess({balance: await WalletModule.getBalance(wallet)}));
        }
    };
}

function getTransactions(address) {
    return async dispatch => {
        const transactions = await WalletService.getTransactions(address);
        dispatch(getTransactionsSuccess(transactions));
    };
}

