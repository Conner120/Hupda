import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { makeStyles } from '@material-ui/core/styles';
import Post from './Comment';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import { useHistory } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from '@material-ui/lab/Skeleton';
import { gql, useQuery } from '@apollo/client';
const GET_PROFILE = gql`
query getProfile($id:String,$offset:Int){
    
    Comments(id:$id,offset:$offset){
        commentPost{
          title
          content
          poster{
              id
              first
              last

          }
          createdAt
          
        }
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
export interface Post {
    id: string,
    title: string,
    postId: string,
    content: string,
    profileId: string,
    alc: number,
    visible: string,
    createdAt: Date,
    updatedAt: Date,
    shareCount: number,
    comments: [Post],
    rootPost?: Post,
    root?: boolean,
    sharedContent?: Post,
}
export interface fdsds {
    Comments: [Post]
}
export default function CommentList(props: { id: string }) {
    const { id } = useParams();
    let [requestSent, setRequestSent] = useState(false)
    let [noComments, setNoComments] = useState(false)
    const { Profile } = useStores()
    const history = useHistory();
    const onCompleted = (data: any) => {
        setRequestSent(!requestSent)
        console.log('dsd')
    }
    const { loading, error, data, fetchMore } = useQuery(GET_PROFILE, { variables: { id: id, offset: 0 }, onCompleted });
    console.log(data)
    if (loading) return (<div><Skeleton variant="text" />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" height={180} /></div>);
    if (error) return <div>Error! {error}</div>;
    return (
        <div>
            {(data.Comments.length > 0) ? <Paper>

                <InfiniteScroll
                    dataLength={data.Comments.length - 2} //This is important field to render the next data
                    next={() => {
                        fetchMore({
                            variables: {
                                offset: data.Comments.length
                            },
                            updateQuery: (prev, { fetchMoreResult }: { fetchMoreResult?: fdsds }) => {
                                if (fetchMoreResult) {
                                    console.log(fetchMoreResult.Comments.length)
                                    if (fetchMoreResult?.Comments.length < 10) {
                                        setNoComments(true)
                                    }
                                    return ({ Comments: data.Comments.concat(fetchMoreResult?.Comments) })
                                }
                            }
                        })

                    }}
                    hasMore={!noComments}
                    loader={<h4>Asking system for more comments...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                // below props only if you need pull down functionality
                // refreshFunction={() => {
                //     console.log('ds')
                // }}
                // pullDownToRefresh
                // pullDownToRefreshContent={
                //     <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                // }
                // releaseToRefreshContent={
                //     <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                //
                >
                    {
                        data.Comments.map((element: any) =>
                            <div >
                                <Post post={element.commentPost} compressed={true} showEnlarge={true} />
                                <br />
                            </div>
                        )
                    }
                </InfiniteScroll>
            </Paper>
                : <h3>No Comments</h3>
            }

        </div >
    )
}
