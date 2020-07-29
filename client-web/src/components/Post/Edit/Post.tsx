import React, { useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Post } from '../../../Htypes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { useStores } from '../../../stores'
import { useHistory } from "react-router-dom";
import { Link, TextField } from '@material-ui/core';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // maxWidth: 345,
            flexShrink: 0,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        content: {
            width: '100%',
            height: '40%'
        },
        titleBox: {
            width: '100%'
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
    }),
);
export default function PostEdit(props: { share: { id: string, post: Post } }) {
    const classes = useStyles();
    const { App } = useStores()
    const history = useHistory();
    const goToProfile = () => {
        history.push(`/profile/${props.share.post?.poster.id}`)
    }
    const [title, setTitle] = useState('')
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(
            event.target.value,
        );
    };
    const [content, setContent] = useState('')
    const handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(
            event.target.value,
        );
    };
    const SendPost = () => {
        if (props.share.id) {
            fetch(`/api/post/share`, {
                method: 'Post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'jwt': App.auth
                },
                body: JSON.stringify({
                    alc: 2,
                    content,
                    title,
                    media: [],
                    id: props.share.id
                })
            }).then(res => {
                return res.json();
            }).then(post => {
                history.push(`/post/${post.id}`)
                // console.log(post)
            });
        } else {
            fetch(`/api/post`, {
                method: 'Post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'jwt': App.auth
                },
                body: JSON.stringify({
                    alc: 2,
                    content,
                    title,
                    media: []
                })
            }).then(res => {
                return res.json();
            }).then(post => {
                history.push(`/post/${post.id}`)
                // console.log(post)
            });
        }
    }
    console.log(props)
    return (
        <div>
            < Card className={classes.root} >
                <CardHeader
                    title={props.share.id ? 'Share Post' : 'Create Post'}
                    subheader={<TextField autoFocus={true} id="standard-basic" autoComplete='off'
                        label="Post Title" value={title} className={classes.titleBox} onChange={handleChangeTitle}></TextField>}
                />
                <CardContent>
                    <TextField
                        id="outlined-multiline-static"
                        label="Content"
                        multiline={true}
                        className={classes.content}
                        variant="outlined"
                        rowsMax={23}
                        onChange={handleChangeContent}
                        value={content}
                    />
                    <br />
                    <br />
                    {props.share.post.id ? < Card raised={true} className={classes.root} >
                        <CardHeader
                            avatar={

                                <Tooltip title={`${props.share.post?.poster.first} ${props.share.post.poster.last}`}>
                                    <Avatar aria-label="recipe" className={classes.large} src={props.share.post?.poster.profilePicURI} alt={`Profile image for ${props.share.post?.poster.first} ${props.share.post?.poster.last}`}>
                                    </Avatar>
                                </Tooltip>
                            }

                            title={<div><Link onClick={goToProfile}><Typography variant='overline'>{`${props.share.post.sharedContent?.poster.first} ${props.share.post.poster.last}`}</Typography></Link> {props.share.post.sharedContent?.title}</div>}
                            subheader={moment(props.share.post?.createdAt).fromNow()}
                        />
                        <CardContent>
                            <Typography>
                                {props.share.post?.content}
                            </Typography>
                        </CardContent>
                        <CardActions>
                        </CardActions>
                    </Card > : <div></div>}
                </CardContent>
                <CardActions className={classes.floatRight}>
                    <Button color='secondary' variant="contained" onClick={SendPost}>Post</Button>
                </CardActions>
            </Card >
        </div >
    )
}
