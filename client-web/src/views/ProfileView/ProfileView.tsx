import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { useStores } from '../../stores'
import { makeStyles } from '@material-ui/core/styles';
import { Post } from '../../components';
import { Post as IPost } from '../../Htypes';
import { profile } from 'console';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import { useHistory } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    expcont: {
        flexFlow: 'column'
    }
}));
export default function PostView() {
    const { id } = useParams();
    let [profile, setProfile] = useState()
    let [requestSent, setRequestSent] = useState(false)
    const { App } = useStores()
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);
    console.log(App.auth)
    const classes = useStyles();
    const history = useHistory();
    const goToPost = (id: string) => {
        history.push(`/post/${id}`)
    }
    useEffect(() => {
        // Run! Like go get some data from an API.
        if (!requestSent) {
            setRequestSent(true)
            fetch(`/api/profile/wPosts?id=${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'jwt': App.auth
                },
            }).then(res => {
                return res.json();
            }).then(post => {
                let prof = post;
                for (let index = 0; index < post.posts.length; index++) {
                    post.posts[index].poster = prof
                }
                setProfile(post)
                console.log(post)
            });
        }
    });
    console.log(profile)
    return (
        <div>
            {(profile) ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ExpansionPanel defaultExpanded>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Your Posts</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.expcont}>
                                {profile.posts.map((element: any) =>
                                    <div onClick={() => { goToPost(element.id) }}>
                                        <Post post={element} compressed={true} />
                                        <br />
                                    </div>
                                )}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                    <Grid item xs={12} md={3}>
                    </Grid>
                </Grid>
                : <h3>loading</h3>
            }
        </div >
    )
}
