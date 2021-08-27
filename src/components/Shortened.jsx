import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LoggedContext } from "../App.js";
import Nav from "./Nav";
import SimilarNews from "./SimilarNews.jsx";
// import "./Shortened.css";
import axiosInstance from "../axios";
import axios from "axios";
import NewsCard from "./Cards/NewsCard";
import LoadingOverlay from "react-loading-overlay";

import { makeStyles } from "@material-ui/core/styles";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    Divider,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "90vh",
        display: "flex",
        padding: "1em",
    },
    sLeft: {
        flex: 2,
        overflowY: "scroll",
        overflowX: "hidden",
    },
    sRight: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    SRtop: {
        flex: 1,
    },
    SRbottom: {
        flex: 1,
    },
    mainFeaturedPost: {
        position: "relative",
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        padding: "1em",
        backgroundImage: "url(https://source.unsplash.com/7egErEz8_OY)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,.3)",
    },
    mainFeaturedPostContent: {
        position: "relative",
        padding: theme.spacing(3),
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(6),
            paddingRight: 0,
        },
    },
    btn: {
        marginTop: 10,
    },
    commentsBox: {
        backgroundColor: "WhiteSmoke",
    },
}));

function Shortened(props) {
    const classes = useStyles();
    const history = useHistory();
    const loggedContext = useContext(LoggedContext);

    const post = props?.location?.state;

    console.log("POST", post);

    const [isSaved, setSaved] = useState(post?.user);
    const [expanded, setExpanded] = useState(false);
    const [loadComments, setLoadComments] = useState([]);
    const [commentField, setCommentField] = useState();
    const [commentEditField, setCommentEditField] = useState();
    const [isSelected, setIsSelected] = useState();
    const [fetcher, toggleFetcher] = useState(1);
    const [active, setActive] = useState(false);
    const [data, setData] = useState([]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    /***** Managing sending comments into the database*****/
    const handleCommentChange = (e) => {
        console.log(commentField);
        setCommentField({
            ...commentField,
            [e.target.name]: e.target.value,
        });
    };

    const handleCommentEditChange = (e) => {
        setCommentEditField({
            ...commentEditField,
            [e.target.name]: e.target.value,
        });
    };

    const handleComment = (e) => {
        if (!commentField || commentField?.body?.trim() === "") {
            alert("Comment Empty");
            return;
        }
        e.preventDefault();
        axiosInstance
            .post(`comments-post/`, {
                body: commentField.body,
                summary: post?.id,
                user: loggedContext?.logState?.user_id,
            })
            .then((res) => {
                if (res.status === 201) {
                    toggleFetcher((fetcher) => fetcher + 1);
                    setCommentField("");
                    //! write some code for triggering accordion if it's not expanded
                }
            });
    };

    const deleteComment = (commentID) => {
        axiosInstance.delete(`comments/${commentID}`).then((res) => {
            if (res.status === 204) {
                toggleFetcher((fetcher) => fetcher + 1);
            }
        });
    };

    const toggleEdit = (commentID) => {
        if (isSelected === commentID) {
            setIsSelected();
        } else {
            setIsSelected(commentID);
        }
    };

    const submitEdit = (commentID) => {
        axiosInstance
            .patch(`comments/${commentID}/`, {
                body: commentEditField.body,
            })
            .then((res) => {
                if (res.status === 200) {
                    toggleFetcher((fetcher) => fetcher + 1);
                    setIsSelected();
                }
            });
    };

    const commentSection = loadComments?.map((comment, index) => {
        if (isSelected === comment.id) {
            return (
                <>
                    <Grid item sm={12}>
                        <Card>
                            <Typography variant="subtitle1">
                                {comment.user.username}
                            </Typography>
                            <TextField
                                defaultValue={comment.body}
                                name="body"
                                onChange={handleCommentEditChange}
                            />
                            <Button onClick={() => submitEdit(comment.id)}>
                                Save
                            </Button>
                            <Button onClick={toggleEdit}>Cancel</Button>
                        </Card>
                    </Grid>
                </>
            );
        } else {
            return (
                <>
                    <Grid item sm={12}>
                        <Card>
                            <Typography>{comment.user.username}</Typography>
                            <Typography>{comment.body}</Typography>
                            {comment.user.id ===
                                loggedContext?.logState?.user_id && (
                                <>
                                    <Button
                                        onClick={() => toggleEdit(comment.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteComment(comment.id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </Card>
                    </Grid>
                    <Divider />
                </>
            );
        }
    });

    const contentMapped = post?.content?.map((item, index) => {
        return (
            <Typography variant="body2" key={index} align="justify">
                - {item}
            </Typography>
        );
    });

    /***** Managing Saving/Deleting Summary For Vault Purposes *****/
    const handleSave = (e) => {
        e.preventDefault();
        if (!loggedContext.logState) {
            history.push("/login");
        }
        axiosInstance
            .patch(`summaries-save/${props.location.state.id}/`, {
                user: loggedContext.logState.user_id,
            })
            .then((res) => {
                console.log("RES.data", res.data);
                setSaved(res.data.user);
            })
            .then(toggleFetcher((fetcher) => fetcher + 1));
    };

    const handleRemove = (e) => {
        console.log("remove id");
        e.preventDefault();
        if (!loggedContext.logState) {
            history.push("/login");
        }
        axiosInstance
            .patch(`summaries-remove/${props.location.state.id}/`, {
                user: "",
            })
            .then((res) => {
                setSaved(res.data.user);
            })
            .then(toggleFetcher((fetcher) => fetcher + 1));
    };
    console.log(loggedContext?.logState?.post);

    const primerSection = post?.primers?.map((primer, index) => {
        const article = {
            title: "What is " + primer[0],
            link: primer[1],
        };
        return <NewsCard index={index} article={article} />;
    });

    // CAN'T ATTACH BODY TO GET, USE PARAMS
    useEffect(() => {
        axiosInstance
            .get(`comments/`, {
                params: {
                    summary: post.id,
                },
            })
            .then((res) => {
                console.log(res.data);
                setLoadComments(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [fetcher]);

    const searchQuery = post?.title //take first 5 words of title
        .split(" ")
        .filter((_, i) => i < 5)
        .join(" ");

    console.log("searching for ", searchQuery);

    const RAPIDAPI = process.env.REACT_APP_RAPIDAPI;

    useEffect(() => {
        const options = {
            method: "GET",
            url: "https://free-news.p.rapidapi.com/v1/search",
            params: {
                q: searchQuery,
                lang: "en",
                page: "1",
            },
            headers: {
                "x-rapidapi-key": RAPIDAPI,
                "x-rapidapi-host": "free-news.p.rapidapi.com",
            },
        };
        axios
            .request(options)
            .then((res) => {
                console.log(res.data);
                res?.data?.articles?.shift();
                setData(res?.data?.articles);
            })
            .catch((err) => console.log(err));
    }, [post?.title]);

    // }

    return (
        <Nav>
            <LoadingOverlay
                active={active}
                spinner
                text="Grabbing a new TLDR..."
            >
                <div className={classes.root}>
                    <div className={classes.sLeft}>
                        <Paper className={classes.mainFeaturedPost}>
                            {
                                <img
                                    style={{ display: "none" }}
                                    src={post.image}
                                    alt={post.imageText}
                                />
                            }
                            <div className={classes.overlay} />
                            <Grid container spacing={2}>
                                <Grid item md={10}>
                                    <div
                                        className={
                                            classes.mainFeaturedPostContent
                                        }
                                    >
                                        <Typography
                                            component="h1"
                                            variant="title"
                                            color="inherit"
                                            gutterBottom
                                        >
                                            {post.title}
                                        </Typography>
                                        <br />
                                        <Typography
                                            variant="body"
                                            color="inherit"
                                            component="p"
                                            align="left"
                                        >
                                            {contentMapped}
                                        </Typography>
                                        <br />
                                        <Link
                                            variant="subtitle1"
                                            color="secondary"
                                            href={post.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Explore more...
                                        </Link>
                                        <Typography
                                            variant="body2"
                                            color="inherit"
                                            paragraph
                                            align="left"
                                        >
                                            tags: {post?.tags?.join(", ")}
                                        </Typography>
                                        {loggedContext.logState && (
                                            <Grid
                                                container
                                                spacing={2}
                                                style={{
                                                    backgroundColor:
                                                        "WhiteSmoke",
                                                    display: "flex",
                                                    padding: "0.1em",
                                                }}
                                            >
                                                <Grid item xs={12} sm={9}>
                                                    <TextField
                                                        label="Pen your thoughts here"
                                                        variant="outlined"
                                                        name="body"
                                                        color="secondary"
                                                        onChange={
                                                            handleCommentChange
                                                        }
                                                        fullWidth
                                                        gutterBottom
                                                        error
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Button
                                                        variant="outlined"
                                                        className={classes.btn}
                                                        color="secondary"
                                                        onClick={handleComment}
                                                    >
                                                        Comment
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}

                                        {!isSaved && (
                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={handleSave}
                                                style={{ width: "110px" }}
                                            >
                                                Save
                                            </Button>
                                        )}
                                        {isSaved && (
                                            <Button
                                                variant="contained"
                                                className="btn"
                                                onClick={handleRemove}
                                                style={{ width: "110px" }}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Accordion
                            expanded={expanded === "panel1"}
                            onChange={handleChange("panel1")}
                            disabled={loadComments.length === 0}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography className={classes.heading}>
                                    View Comments({loadComments.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container className={classes.comments}>
                                    {commentSection}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classes.sRight}>
                        <div className={classes.SRtop}>
                            <Typography
                                variant="h5"
                                style={{ backgroundColor: "Gainsboro" }}
                            >
                                Primers
                            </Typography>
                            {primerSection}
                        </div>
                        <div className={classes.SRbottom}>
                            <Typography
                                variant="h5"
                                style={{ backgroundColor: "Gainsboro" }}
                            >
                                Similar News
                            </Typography>
                            <SimilarNews
                                post={searchQuery}
                                data={data}
                                active={active}
                                setActive={setActive}
                            />
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        </Nav>
    );
}

export default Shortened;
