import React from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'

import { Post, CommentList } from '../../components'
import Skeleton from '@material-ui/lab/Skeleton';
import { gql, useQuery } from '@apollo/client';
const GET_POST = gql`
  query GetPost($id:String) {
    Post(id:$id){
        id
        poster{
            first
            last
            id
            profilePicURI
        }
        title
        content
        createdAt
    }
  }
`;
export default function PostView() {
    const { id } = useParams();
    const prof = useStores().Profile
    const { loading, error, data } = useQuery(GET_POST, {
        variables: { id: id ? id : prof.id },
    });

    if (loading) return (<div><Skeleton variant="text" />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" height={180} /></div>);
    if (error) return <div>Error! {error}</div>;
    return (

        <div>
            {(data) ? <div> <Post post={data.Post} compressed={false} requestedId={id} /> <CommentList id={data.Post.id} /></div> : <h3>loading</h3>}

        </div>
    )
}
