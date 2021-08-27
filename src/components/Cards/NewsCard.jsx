import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    Link,
    Typography,
} from "@material-ui/core/";

const useStyles = makeStyles({
    root: {
        display: "flex",
        border: "1px solid black",
    },
    media: {
        height: "10vh",
        padding: "0.5em",
    },
    tldr: {
        fontWeight: "bold",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "Black",
    },
    btn: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "1em",
    },
});

export default function NewsCard({ post, article, setActive }) {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState("false");
    const [activeState, setActiveState] = useState(0)

    console.log("NEWCARD POST ", post)

    useEffect(() => {
        setActiveState(activeState => activeState + 1)
    }, [post])

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(!loading);
        setActive(true)

        axiosInstance
            .post(`summaries-shorten/`, {
                url: article.link || article.url,
            })
            .then((res) => {
                console.log("res: ", res);
                setActive(false)
                history.push("/shortened", res?.data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(!loading);
            });
    };

    return (
        <Card className={classes.root}>
            <CardActionArea
                href={article.link || article.url}
                target="_blank"
                rel="noreferrer"
            >
                {article.media && (
                    <CardMedia
                        className={classes.media}
                        image={article.media}
                        title={article.title}
                    />
                )}
                <CardContent>
                    <Typography gutterBottom variant="subtitle2">
                        {article.title}
                    </Typography>
                    {article.summary && (
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            component="p"
                        >
                            {article?.summary?.slice(0, 100) + "..."}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container className={classes.btn}>
                    <Grid item sm={3}>
                        {article.media && (
                            <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                className={classes.tldr}
                                onClick={handleSubmit}
                            >
                                TLDR this
                            </Button>
                        )}
                    </Grid>
                    <Grid item sm={3}>
                        {article.link && (
                            <Link
                                variant="subtitle1"
                                color="secondary"
                                href={article.link || article.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Explore more
                            </Link>
                        )}
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
}
