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
import InfiniteScroll from 'react-infinite-scroll-component';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Skeleton from '@material-ui/lab/Skeleton';
import { gql, useQuery } from '@apollo/client';
const GET_PROFILE = gql`
query getProfile($id:String){
    
    MyPosts(page:0,size:10){
      title
      id
      content
      poster{
        first
        id
        last
        profilePicURI
      }
    }
    PostCount(Profile:$id){
        posts
        shares
    }
  }
`;

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
    const classes = useStyles();
    let [requestSent, setRequestSent] = useState(false)
    const { App, Profile } = useStores()
    const history = useHistory();
    const goToPost = (id: string) => {
        history.push(`/post/${id}`)
    }
    let [requestedId, setRequestedId] = useState(id)
    const { loading, error, data, fetchMore } = useQuery(GET_PROFILE, { variables: { id: (id ? id : Profile.id) } });
    if (loading) return (<div><Skeleton variant="text" />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" height={180} /></div>);
    // if (error) return `Error! ${error}`;
    return (
        <div>
            {(data) ?
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                    </Grid>
                    <Grid item xs={12} md={9} xl={6}>
                        <InfiniteScroll
                            dataLength={data.PostCount.posts} //This is important field to render the next data
                            next={() => {
                                console.log('ds')
                            }}
                            hasMore={true}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                            // below props only if you need pull down functionality
                            refreshFunction={() => {
                                console.log('ds')
                            }}
                            pullDownToRefresh
                            pullDownToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                            }
                            releaseToRefreshContent={
                                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                            }>
                            {
                                data.MyPosts.map((element: any) =>
                                    <div >
                                        <Post post={element} compressed={true} showEnlarge={true} />
                                        <br />
                                    </div>
                                )
                            }
                        </InfiniteScroll>
                    </Grid>
                </Grid>
                : <h3>loading</h3>
            }

        </div >
    )
}
