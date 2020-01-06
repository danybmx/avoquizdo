import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import {
  Container,
  makeStyles,
  Grid,
  IconButton,
  Menu,
  MenuItem
} from "@material-ui/core";
import LanguageIcon from "@material-ui/icons/Language";
import { useTranslation } from "react-i18next";
import QuizzesList from "./pages/QuizzesList";
import QuizEditor from "./pages/QuizEditor";
import "./i18n";

const useStyles = makeStyles(theme => ({
  main: {
    padding: theme.spacing(0, 0, 1)
  },
  languageButton: {
    color: "white",
    borderColor: "white"
  }
}));

function App() {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);

  function toggleLanguageMenu(ev) {
    if (menuAnchorElement !== null) {
      setMenuAnchorElement(null);
    } else {
      setMenuAnchorElement(ev.currentTarget);
    }
  }

  function closeLanguageMenu() {
    setMenuAnchorElement(null);
  }

  async function selectLanguage(lang) {
    await i18n.changeLanguage(lang);
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <Typography component="h1" variant="h6" noWrap>
                {t("Quiz manager")}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                data-testid="language-menu-button"
                className={classes.languageButton}
                onClick={toggleLanguageMenu}
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorElement}
                keepMounted
                open={Boolean(menuAnchorElement)}
                onClose={closeLanguageMenu}
                data-testid="language-menu"
              >
                <MenuItem
                  data-testid="language-gl"
                  onClick={() => selectLanguage("gl")}
                >
                  Galego
                </MenuItem>
                <MenuItem
                  data-testid="language-es"
                  onClick={() => selectLanguage("es")}
                >
                  Castellano
                </MenuItem>
                <MenuItem
                  data-testid="language-en"
                  onClick={() => selectLanguage("en")}
                >
                  English
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <main className={classes.main}>
        <Container maxWidth="lg" className="main-container">
          <Switch>
            <Route exact path="/">
              <QuizzesList />
            </Route>
            <Route path="/edit/:quizId">
              <QuizEditor />
            </Route>
            <Route path="/create">
              <QuizEditor />
            </Route>
          </Switch>
        </Container>
      </main>
    </div>
  );
}

export default App;
