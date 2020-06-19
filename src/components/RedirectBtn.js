import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/RedirectBtn.css';

export default function RedirectBtn({destination}) {
  return (
    <Link to={`${destination}`}
      className="button">
      {`<- List`}
    </Link>
  )
}