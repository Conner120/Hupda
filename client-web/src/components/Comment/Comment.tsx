import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Post } from '../../Htypes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import { useStores } from '../../stores'
import moment from 'moment';
import ShareIcon from '@material-ui/icons/Share';
import { useHistory } from "react-router-dom";
import { Link, IconButton } from '@material-ui/core';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: 10,
            width: '90%',
            float: 'right'
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        floatRight: {
            float: 'right'
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
        },
        large: {
            width: theme.spacing(6),
            height: theme.spacing(6),
        },
        content: {
            whiteSpace: 'pre-wrap',
            overflowY: 'auto', /* Add vertical scrollbar */
            // width: '100%',
        }
    }),
);

export default function Comment(props: { post: Post, compressed?: boolean }) {
    const classes = useStyles();
    let [comments, setComments] = useState()
    let [requestSent, setRequestSent] = useState(false)
    const history = useHistory();
    const { App } = useStores()
    const goToPost = (id: string) => {
        history.push(`/post/${id}`)
    }
    const goToProfile = () => {
        if (window.location.pathname !== `/profile/${props.post.poster.id}`) {

            history.push(`/profile/${props.post.poster.id}`)
        }
    }
    const sharePost = () => {
        if (window.location.pathname !== `/create/post/${props.post.id}/true`) {
            history.push(`/create/post/${props.post.id}/true`)
        }
    }
    useEffect(() => {
    });
    return (
        <div className={classes.root}>
            <Card variant="outlined">
                dsds
            </Card>
        </div >
    )
}
