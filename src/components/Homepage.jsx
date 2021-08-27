import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Nav from "./Nav";
import axiosInstance from "../axios";
import LoadingOverlay from "react-loading-overlay";

import { makeStyles } from "@material-ui/core/styles";
import {
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CallMadeIcon from "@material-ui/icons/CallMadeSharp";
import WrapTextIcon from "@material-ui/icons/WrapText";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: "0 auto",
        marginTop: "10vh",
        width: "80vw",
        height: "50vh",
        // position: "fixed",
        // top: "40%",
        // left: "50%",
        // transform: "translate(-50%,-50%)",
        fontFamily: "Poppins",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "left",
    },
    button: {
        width: "200px",
        margin: theme.spacing(1),
        fontWeight: 600,
    },
    section1: {
        margin: theme.spacing(3, 2),
    },
    section2: {
        margin: theme.spacing(2),
    },
    section3: {
        margin: theme.spacing(3, 1, 1),
        padding: "1em",
    },
    title: {
        fontWeight: 700,
        marginBottom: "1em",
    },
    subtitle: {
        fontStyle: "italic",
    },
    desCard: {
        backgroundColor: "WhiteSmoke",
    },
    des: {
        marginBottom: "1em",
    },
    vp: {
        display: "block",
        marginTop: "1em",
    },
}));

function Homepage() {
    const classes = useStyles();
    const history = useHistory();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const val = e.target.value;
        console.log(val);
        setUrl(val);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(!loading);

        axiosInstance
            .post(`summaries-shorten/`, {
                url: url,
            })
            .then((res) => {
                console.log("res: ", res);
                history.push("/shortened", res?.data);
            })
            .catch((err) => {
                console.log(err);
                window.location.reload();
                setUrl("");
                setLoading(!loading);
            });
    };

    return (
        <Nav>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <LoadingOverlay
                        active={loading}
                        spinner
                        text="Storing your saved time..."
                    >
                        <div className={classes.section1}>
                            <Grid item sm>
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    className={classes.title}
                                >
                                    TLDRwithFriends
                                </Typography>
                            </Grid>
                        </div>
                        <div className={classes.section2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Enter URL"
                                        variant="outlined"
                                        color="secondary"
                                        placeholder="TLDR this"
                                        onChange={handleChange}
                                        fullWidth
                                        gutterBottom
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    {url ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                            onClick={handleSubmit}
                                            endIcon={
                                                loading ? (
                                                    <WrapTextIcon fontSize="small" />
                                                ) : (
                                                    <ScheduleIcon fontSize="small" />
                                                )
                                            }
                                        >
                                            {loading
                                                ? "..."
                                                : "Let's Save Time!"}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.button}
                                            onClick={handleSubmit}
                                            disabled
                                        >
                                            Let's Add A URL.
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography
                                        color="textSecondary"
                                        variant="subtitle2"
                                        className={classes.subtitle}
                                        endIcon={<CallMadeIcon />}
                                        gutterBottom
                                    >
                                        Just drop your link and TLDR it{"  "}
                                        <CallMadeIcon
                                            color="secondary"
                                            style={{ fontSize: 13 }}
                                        />
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.section3}>
                            <Grid container spacing={2}>
                                <Card className={classes.desCard} elevation={0}>
                                    <CardContent>
                                        <Typography
                                            className={classes.des}
                                            variant="body"
                                            component="p"
                                        >
                                            No time to read your favourite
                                            articles? Want a gist of what your
                                            friend just sent you so that you can
                                            tell them you read it? Then use{" "}
                                            <strong>TLDRwithFriends</strong> to
                                            get an easily digestible and
                                            comprehensible summary of those 15
                                            minute articles you just can’t find
                                            the time to read!
                                        </Typography>
                                        <Divider />
                                        <Typography className={classes.vp}>
                                            What you get:
                                        </Typography>
                                        <ListItem>
                                            <ListItemText secondary=" - Quick Summary of the article" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText secondary=" - Primers" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText secondary=" - Links discussing same topic" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                secondary=" - TLDR Vault to store all your
                                            articles"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText secondary=" - Saved Friendships" />
                                        </ListItem>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </div>
                    </LoadingOverlay>
                </Paper>
            </div>
        </Nav>
    );
}

export default Homepage;
