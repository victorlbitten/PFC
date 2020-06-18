import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Api.css';

export default function Api({api}) {
  return (
    <Link to={`apis/${api.id}`}
      className="api--link">
      {api.name}
    </Link>
  )
}