import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/NotFoundPage.css'

const NotFoundPage = () => (
  <div>
    404! - <Link to="/">Go home</Link>
  </div>
);

export default NotFoundPage;