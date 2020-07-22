import React, { Component } from "react";
// import { browserHistory } from "react-router";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { Fremskrivning } from "./Fremskrivning";
import { Annuitet } from "./Annuitet";
import { About } from "./About";
import { Finans } from "./Finans";
import { Contact } from "./Contact";
import { NoMatch } from "./NoMatch";
import { Layout } from "./components/Layout";
import { NavigationBar } from "./components/NavigationBar";
import { Jumbotron } from "./components/Jumbotron";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavigationBar />
          <Jumbotron />
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/fremskrivning" component={Fremskrivning} />
              <Route path="/about" component={About} />
              <Route path="/finans" component={Finans} />
              <Route path="/annuitet" component={Annuitet} />
              <Route path="/contact" component={Contact} />
              <Route path="/*" component={Home} />
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
