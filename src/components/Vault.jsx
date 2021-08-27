import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../axios";
import Nav from "./Nav";
import "./Vault.css";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

function Vault() {
    const history = useHistory();
    const classes = useStyles();
    const [vault, setVault] = useState();
    const [selectedTopic, setSelectedTopic] = useState("all-topics-to-show");
    useEffect(() => {
        axiosInstance.get(`summaries/`).then((res) => {
            console.log(res);
            setVault(res);
        });
    }, []);

    const topicList = [];
    vault?.data.map((datum) => {
        for (let i = 0; i < datum?.tags?.length; i++) {
            if (!topicList.includes(datum?.tags[i])) {
                topicList.push(datum?.tags[i]);
            }
        }
    });

    const sortedTopicList = topicList.sort();

    const readMore = (post) => {
        history.push("/shortened", post);
    };

    const results = vault?.data?.map((post) => {
        if (selectedTopic === "all-topics-to-show") {
            return (
                <Card className={classes.root}>
                    <CardContent>
                        <Typography
                            className={classes.title}
                            color="textSecondary"
                            gutterBottom
                        >
                            {post.title}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => readMore(post)}>
                            Read More
                        </Button>
                    </CardActions>
                </Card>
            );
        } else {
            if (post?.tags?.includes(selectedTopic)) {
                return (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography
                                className={classes.title}
                                color="textSecondary"
                                gutterBottom
                            >
                                {post.title}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => readMore(post)}>
                                Read More
                            </Button>
                        </CardActions>
                    </Card>
                );
            }
        }
    });

    if (!vault) {
        return (
            <Nav>
                <h1>Loading, please wait</h1>
            </Nav>
        );
    } else {
        return (
            <Nav>
                <div className="container">
                    <div className="topHalf">
                        <div className="topics">
                            <h3>Searched Topics</h3>
                            <div className={classes.root}>
                                <List
                                    component="nav"
                                    aria-label="main mailbox folders"
                                >
                                    <ListItem
                                        button
                                        onClick={() =>
                                            setSelectedTopic(
                                                "all-topics-to-show"
                                            )
                                        }
                                    >
                                        <ListItemText primary="All Topics" />
                                    </ListItem>
                                    {sortedTopicList.map((topic, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                button
                                                onClick={() =>
                                                    setSelectedTopic(topic)
                                                }
                                            >
                                                <ListItemText primary={topic} />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </div>
                        </div>
                        <div className="results">
                            {selectedTopic !== "all-topics-to-show" && (
                                <h3>Topic: {selectedTopic}</h3>
                            )}
                            {results}
                        </div>
                    </div>
                    {/* <div className="bottomHalf">analytics?</div> */}
                </div>
            </Nav>
        );
    }
}

export default Vault;
