import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import './account.scss';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { Translate } from '../../components/translate/translate.component';
import List from 'preact-material-components/List';
import { ListItem } from '../../components/list-item/list-item.component';
import { convertUnit } from '../../../utils/blockchain/utils';
import BigNumber from 'bignumber.js';
import { IDevice } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';
import DashboardPage from '../dashboard/dashboard.container';
import { Link } from 'preact-router';

import { AccountCard } from './components/account-card/account-card.component';
import AddressCard from './components/address-card/address-card.container';
import TestnetWarning from '../../components/testnet-warning/testnet-warning.container';
import { TransactionStatus } from 'moonlet-core/src/core/transaction';

interface IProps {
    accounts: any[];
    account: any;
    device: IDevice;
}

export class AccountPage extends Component<IProps> {
    public getPaddingTopStyle() {
        const topBarElement = document.querySelector('.top-bar');
        if (topBarElement) {
            return { paddingTop: topBarElement.clientHeight };
        }
        return {};
    }

    public render() {
        if (!this.props.account) {
            return null;
        }

        if (this.props.device.screenSize === DeviceScreenSize.SMALL) {
            return this.renderAccountPage();
        }
        return (
            <div class="big-screen-dashboard" style={this.getPaddingTopStyle()}>
                <DashboardPage
                    hideTestNetWarning={true}
                    selectedAccount={{
                        blockchain: this.props.account.node.blockchain,
                        address: this.props.account.address
                    }}
                />
                {this.renderAccountPage()}
            </div>
        );
    }

    public renderAccountPage() {
        if (this.props.account) {
            return (
                <div class="account-page">
                    <TestnetWarning account={this.props.account} />
                    <AccountCard account={this.props.account} />
                    <AddressCard account={this.props.account} showMenu={true} />
                    <div class="actions">
                        <Link
                            class="button"
                            href={`/send/${this.props.account.node.blockchain}/${
                                this.props.account.address
                            }`}
                        >
                            <img src="/assets/icons/send.svg" />
                            <br />
                            <Translate text="App.labels.send" />
                        </Link>
                        <Link
                            class="button"
                            href={`/receive/${this.props.account.node.blockchain}/${
                                this.props.account.address
                            }`}
                        >
                            <img src="/assets/icons/receive.svg" />
                            <br />
                            <Translate text="App.labels.receive" />
                        </Link>
                    </div>
                    {this.props.account.transactions.length > 0 && (
                        <Card>
                            <Translate
                                text="App.labels.transactions"
                                className="transactions-label"
                            />
                            <List two-line={true}>
                                {this.props.account.transactions
                                    .sort((a, b) => {
                                        return b.times[0].unixtime - a.times[0].unixtime;
                                    })
                                    .map((tx, index, transactions) => (
                                        <ListItem
                                            primaryText={
                                                BLOCKCHAIN_INFO[this.props.account.node.blockchain]
                                                    .coin +
                                                ' ' +
                                                convertUnit(
                                                    this.props.account.node.blockchain,
                                                    new BigNumber(
                                                        (tx as any).value || (tx as any).amount
                                                    ),
                                                    BLOCKCHAIN_INFO[
                                                        this.props.account.node.blockchain
                                                    ].defaultUnit,
                                                    BLOCKCHAIN_INFO[
                                                        this.props.account.node.blockchain
                                                    ].coin
                                                ).toString()
                                            }
                                            secondaryText={
                                                tx.times[0]
                                                    ? new Date(
                                                          tx.times[0].unixtime * 1000
                                                      ).toLocaleString()
                                                    : ''
                                            }
                                            href={`/transaction/${
                                                this.props.account.node.blockchain
                                            }/${this.props.account.address}/${tx.id}`}
                                            icon={<img src="/assets/icons/send.svg" width="48" />}
                                            noDivider={index === transactions.length - 1}
                                        >
                                            {[
                                                TransactionStatus.PENDING,
                                                TransactionStatus.SUCCESS,
                                                TransactionStatus.FAILED
                                            ].indexOf(tx.status) >= 0 && (
                                                <Translate
                                                    text={`App.labels.${tx.status.toLowerCase()}`}
                                                    className={`transaction-status-badge ${tx.status.toLowerCase()}`}
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                            </List>
                        </Card>
                    )}
                </div>
            );
        }

        return null;
    }
}
