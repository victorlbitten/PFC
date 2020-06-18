import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from '../App';
import Header from '../Header';
import About from '../About';
import NotFoundPage from '../NotFoundPage'


const Routes = () => (
  <BrowserRouter>
    <div>
      <Header />

      <Switch>
        <Route exact path="/">
            <App />
        </Route>

        <Route path="/about">
          <About />
        </Route>
        
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  </BrowserRouter>
);

export default Routes;