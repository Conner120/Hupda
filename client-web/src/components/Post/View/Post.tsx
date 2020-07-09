import React, { useState, useEffect } from 'react'
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
import { useStores } from '../../../stores'
import { Comment } from '../../../components'
import moment from 'moment';
import ShareIcon from '@material-ui/icons/Share';
import { useHistory } from "react-router-dom";
import { Link, IconButton } from '@material-ui/core';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // height: '-webkit-fill-available'
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

export default function PostView(props: { post: Post, compressed?: boolean, requestedId?: string }) {
    const classes = useStyles();
    let [comments, setComments] = useState()
    let [requestSent, setRequestSent] = useState(false)
    const history = useHistory();
    const { App } = useStores()
    const goToPost = (id: string) => {
        if (id != props.requestedId) {
            // history.replace(`/post/${id}`)
            history.push(`/post/${id}`)
        }
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
    return (
        <div >
            <div onClick={() => { goToPost(props.post.id) }}>
                < Card className={classes.root} >
                    <CardHeader
                        avatar={

                            <Tooltip title={`${props.post.poster.first} ${props.post.poster.last}`}>
                                <Avatar aria-label="recipe" className={classes.large} src={props.post.poster.profilepicuri} alt={`Profile image for ${props.post.poster.first} ${props.post.poster.last} `}>
                                </Avatar>
                            </Tooltip>
                        }

                        title={<div><Link onClick={goToProfile}><Typography variant='overline'>{`${props.post.poster.first} ${props.post.poster.last} `}</Typography></Link> {props.post.title}</div>}
                        subheader={moment(props.post.createdAt).fromNow()}
                    />
                    <CardContent>
                        <div className={classes.content} style={props.compressed ? { maxHeight: 200 } : { maxHeight: 500 }}>
                            {props.post.content.split('\n').map((i) => {
                                return (<Typography>
                                    {i}
                                </Typography>)
                            })}
                        </div>
                        {props.post.sharedContent ? <div><br />< Card raised={true} className={classes.root} >
                            <CardHeader
                                avatar={

                                    <Tooltip title={`${props.post.sharedContent?.poster.first} ${props.post.poster.last} `}>
                                        <Avatar aria-label="recipe" className={classes.large} src={props.post.sharedContent?.poster.profilepicuri} alt={`Profile image for ${props.post.sharedContent?.poster.first} ${props.post.sharedContent?.poster.last} `}>
                                        </Avatar>
                                    </Tooltip>
                                }

                                title={<div><Link onClick={goToProfile}><Typography variant='overline'>{`${props.post.sharedContent?.poster.first} ${props.post.poster.last} `}</Typography></Link> <Link onClick={goToProfile}>{props.post.sharedContent?.title}</Link></div>}
                                subheader={moment(props.post.sharedContent?.createdAt).fromNow()}
                            />
                            <CardContent>
                                <Typography className={classes.content}>
                                    {props.post.sharedContent?.content}
                                </Typography>
                            </CardContent>
                            <CardActions>
                            </CardActions>
                        </Card > </div> : <div></div>}
                    </CardContent>
                    {props.compressed ? <div /> :
                        < CardActions className={classes.floatRight}>
                            {
                                props.post.sharedContent ? <></> : <IconButton onClick={sharePost}><ShareIcon /></IconButton>
                            }
                        </CardActions>
                    }
                </Card >
            </div>
            {(comments) ?
                comments.map((element: any) =>
                    <div onClick={() => { goToPost(element.id) }}>
                        <Comment post={element} />
                        test
                    </div>
                ) : <div />}
            {props.post.comments ?
                !props.post.comments[0].root ? <Comment post={props.post.comments[0]} />
                    : <div />
                : <div />}
        </div >
    )
}
