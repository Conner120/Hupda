import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { Post } from '../../components'
export default function PostView() {
    const { id } = useParams();
    let [post, setPost] = useState()
    let [requestSent, setRequestSent] = useState(false)
    const { App } = useStores()

    console.log(App.auth)
    useEffect(() => {
        // Run! Like go get some data from an API.
        if (!requestSent) {
            setRequestSent(true)
            fetch(`/api/post?id=${id}&comments=true`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'jwt': App.auth
                },
            }).then(res => {
                return res.json();
            }).then(post => {
                if (post.rootPost) {
                    let tempPost = post.rootPost
                    tempPost.comments = [post]
                    console.log(tempPost)
                    setPost(tempPost)
                }
                // setPost(post)
                // console.log(post)
            });
        }
    });
    return (
        <div>
            {(post) ? <Post post={post} compressed={(post.comments[0].rootPost ? false : true)} /> : <h3>loading</h3>}
        </div>
    )
}
