import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import '../styles/components/Api.css';

export default function Api({api, onDelete}) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div style={{position: 'relative'}}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}>
      <Link to={{
          pathname: `apis/${api.id}`,
          state: api
        }}
        className="api--link">
        {api.name}
      </Link>
      <DeleteButton isShown={isShown} apiId={api.id} onDelete={onDelete}/>
    </div>
  )
}