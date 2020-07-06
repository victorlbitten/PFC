import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import '../styles/components/Api.css';

export default function Api({api, onDelete}) {
  const shouldShowDeleteBtn = (api.id !== 'create');
  const [showDeleteBtn, setshowDeleteBtn] = useState(false);

  return (
    <div style={{position: 'relative'}}
      onMouseEnter={() => setshowDeleteBtn(shouldShowDeleteBtn)}
      onMouseLeave={() => setshowDeleteBtn(false)}>
      <Link to={{
          pathname: `apis/${api.id}`,
          state: api
        }}
        className="api--link">
        {api.name}
      </Link>
      <DeleteButton isShown={showDeleteBtn} apiId={api.id} onDelete={onDelete}/>
    </div>
  )
}