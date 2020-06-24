import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie'
import { createBrowserHistory } from "history";
import {
    Home as HomeView,
    NotFound as NotFoundView
} from './views';
const Routes = () => {
    if (!Cookies.get('jwt')) {

    }

    return (
        <Switch>
            <Route exact path="/" component={HomeView} />
            <Route
                component={HomeView}
                exact
                path="/home"
            />
            <Route
                component={NotFoundView}
                exact
                path="/home"
            />
            <Redirect to="/not-found" />
        </Switch>
    );
};

export default Routes;
