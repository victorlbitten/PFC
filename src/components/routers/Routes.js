import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Apis from '../Apis';
import ApiDetails from '../ApiDetails';
import Header from '../Header';
import About from '../About';
import NotFoundPage from '../NotFoundPage'


const Routes = () => (
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/">
          <Apis />
        </Route>

        <Route path="/about">
          <About />
        </Route>

        <Route path="/apis/:id"
          component={ApiDetails}>
        </Route>
        
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;