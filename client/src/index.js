import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import DepositCheque from './components/DepositCheque';
import ShowBankWallets from './components/ShowBankWallets';

import './index.css';

import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import registerServiceWorker from './registerServiceWorker';

render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/blocks/' component={Blocks} />
            <Route path='/conduct-transaction/' component={ConductTransaction} />
            <Route path='/deposit-cheque/' component={DepositCheque} />
            <Route path='/transaction-pool' component={TransactionPool} />
            <Route path='/show-bank-wallets' component={ShowBankWallets} />
            //for login stuff
             <Route  path="/register" component={Register} />
             <Route  path="/login" component={Login} />
             <Route  path="/profile" component={Profile} />
        </Switch>
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();