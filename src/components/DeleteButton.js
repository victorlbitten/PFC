import React from 'react';
import '../styles/components/DeleteButton.css';
import { deleteApi } from '../factories/Apis.factory';

export default function DeleteButton ({isShown, apiId, onDelete}) {
  function handleDeletion () {
    deleteApi(apiId);
    onDelete(apiId);
  }
  return (
    isShown &&
    <div className="delete-button"
      onClick={handleDeletion}
      >
      X
    </div>
  )
}