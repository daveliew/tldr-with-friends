import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import Nav from "./Nav";
import axiosInstance from "../axios.js"

import {Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        TLDRwithFriends
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const initialFormData = Object.freeze({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: ""
  })

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
      updateFormData({
          ...formData,
          [e.target.name]: e.target.value.trim(),
      })
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      if(formData.first_name === "" || formData.last_name === "" || formData.username === "" || formData.email === "" || formData.password === "") {
        alert("Please Enter All Fields!")
        return
      }
      if (formData.password.length < 6) {
        alert("Please Enter A Valid Password (6 Or More Characters)")
        return
      }
      axiosInstance
        .post(`users/`, {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name
        })
        .then((res) => {
            console.log(res.status)
            if (res.status === 400) {
              alert("Username/Email Taken")
            }
            history.push('/login');
            console.log(res);
            console.log(res.data);
        })
  }

  return (
    <Nav>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="first_name"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={handleChange}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="lname"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="uname"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Nav>
  );
}
