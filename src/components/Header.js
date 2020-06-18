import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/Header.css';
import logo from '../settings.svg';


const Header = () => (
  <header className="header">
    <div className="header--container">
      <span className="header--title">
        <img src={logo} className="header--logo" alt="logo"></img>
        NextAPI
      </span>
      <div className="menu">
          <NavLink exact to="/"
            className="menu--element"
            activeClassName="menu--element--active">
              Home
          </NavLink>
          <NavLink to="/about"
            className="menu--element"
            activeClassName="menu--element--active">
            About
          </NavLink>
      </div>
    </div>
  </header>
)

export default Header;