import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { Post } from '../../components'
import Skeleton from '@material-ui/lab/Skeleton';
import { gql, useQuery } from '@apollo/client';
import Profile from '../../stores/ProfileState';
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
    }
  }
`;
export default function PostView() {
    const { id } = useParams();
    let [requestSent, setRequestSent] = useState(false)
    const { App } = useStores()
    const prof = useStores().Profile
    let [requestedId, setRequestedId] = useState(id)
    const { loading, error, data } = useQuery(GET_POST, {
        variables: { id: id ? id : prof.id },
    });
    if (loading) return (<div><Skeleton variant="text" />
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton variant="rect" height={180} /></div>);
    // if (error) return `Error! ${error}`;
    return (

        <div>
            {(data) ? <Post post={data.Post} compressed={false} requestedId={id} /> : <h3>loading</h3>}
        </div>
    )
}
