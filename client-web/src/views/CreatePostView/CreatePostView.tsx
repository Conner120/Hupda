import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { PostEdit } from '../../components'
import { Post } from '../../Htypes';

export default function PostView() {
    const { id } = useParams();
    let [post, setPost] = useState({} as Post)
    let [requestSent, setRequestSent] = useState(false)
    const { App } = useStores()
    useEffect(() => {
        // Run! Like go get some data from an API.
        if ((!requestSent) && id) {
            setRequestSent(true)
            fetch(`/api/post?id=${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'jwt': App.auth
                },
            }).then(res => {
                return res.json();
            }).then(post => {
                setPost(post)
                // console.log(post)
            });
        }
    });
    console.log(App.auth)
    return (
        <div>
            {(post) ? <PostEdit share={{ id, post: post }} /> : <h3>loading</h3>}
        </div>
    )
}
