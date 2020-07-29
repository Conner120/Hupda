import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
import {
    Home as HomeView,
    NotFound as NotFoundView,
    PostView,
    LoginView,
    ProfileView,
    TopicView,
    CreatePostView,
} from './views';
import { useStores } from './stores'
import Profile from './stores/ProfileState';

const Routes = () => {
    let history = useHistory();
    const { App } = useStores()
    if (Cookies.get('jwt')) {
    } else {
        history.push('/login')
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
                path="/not-found"
            />
            <Route path="/post/:id">
                <PostView />
            </Route>
            <Route path="/create/post/:id">
                <CreatePostView />
            </Route>
            <Route path="/create/post">
                <CreatePostView />
            </Route>
            <Route
                component={LoginView}
                exact
                path="/login"
            />
            <Route
                path="/profile/:id"
            >
                <ProfileView />
            </Route>
            <Route
                path="/profile"
            >
                <ProfileView />
            </Route>
            <Route
                path="/topic/:id"
            >
                <TopicView />
            </Route>
            <Route
                path="/topic"
            >
                <TopicView />
            </Route>
            <Redirect to="/not-found" />
        </Switch>
    );
};

export default Routes;
