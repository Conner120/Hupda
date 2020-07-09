import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { Post } from '../../components'
export default function PostView() {
    const { id } = useParams();
    let [post, setPost] = useState()
    let [requestSent, setRequestSent] = useState(false)
    const { App } = useStores()
    let [requestedId, setRequestedId] = useState(id)
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
                if (!post.root) {
                    let tempPost = post.rootPost
                    tempPost.comments = [post]
                    setPost(tempPost)
                } else {
                    let tempPost = post
                    setPost(tempPost)
                }
            });
        } else {
            if (requestedId != id) {
                setRequestedId(id)
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
                    if (!post.root) {
                        let tempPost = post.rootPost
                        tempPost.comments = [post]
                        setPost(tempPost)
                    } else {
                        let tempPost = post
                        setPost(tempPost)
                    }
                });
            }
        }
    });
    return (
        <div>
            {(post) ? <Post post={post} compressed={false} requestedId={id} /> : <h3>loading</h3>}
        </div>
    )
}
