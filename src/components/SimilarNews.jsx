import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import NewsCard from "./Cards/NewsCard";

import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: "50vh",
        overflowY: "scroll",
        marginLeft: "2em",
        marginTop: "1em",
    },
    articles: {
        height: "40vh",
        width: "30vw",
    },
}));

// const RAPIDAPI = process.env.REACT_APP_RAPIDAPI;

const SimilarNews = ({ post, active, setActive, data }) => {
    const classes = useStyles();
    const [change, setChange] = useState(data)
    console.log("POST", post)
    // const searchQuery = post?.title //take first 5 words of title
    //     .split(" ")
    //     .filter((_, i) => i < 5)
    //     .join(" ");

    // console.log("searching for ", searchQuery);

    // const [data, setData] = useState([]);

    // const options = {
    //     method: "GET",
    //     url: "https://free-news.p.rapidapi.com/v1/search",
    //     params: {
    //         q: searchQuery,
    //         lang: "en",
    //         page: "1",
    //     },
    //     headers: {
    //         "x-rapidapi-key": RAPIDAPI,
    //         "x-rapidapi-host": "free-news.p.rapidapi.com",
    //     },
    // };

    // useEffect(() => {
    //     axios
    //         .request(options)
    //         .then((res) => {
    //             console.log(res.data);
    //             setData(res.data.articles);
    //         })
    //         .catch((err) => console.log(err));
    // }, [active]);

    const mappedArticles = data?.map((article, index) => {
        return <NewsCard key={index} article={article} setActive={setActive} post={post}/>;
    });

    return (
        <>
            <div className={classes.root}>
                <Grid className={classes.articles}>
                    {data ? (
                        mappedArticles
                    ) : (
                        <p>Sorry we didn't find anything!</p>
                    )}
                </Grid>
            </div>
        </>
    );
};

export default SimilarNews;
