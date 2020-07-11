import React from 'react';
import '../styles/components/SaveButton.css';
import { saveApi, createApi } from '../factories/Apis.factory';

export default function SaveButton ({api, description, newApi}) {
  function createNewApi () {
    try {
      createApi(api, description)
    } catch(error) {
      console.log(error);
    }
  }

  function saveEditions () {
    try {
      saveApi(api, description);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSave = () => {
    if (newApi) {
      createNewApi();
    } else {
      saveEditions();
    }
  };

  return (
    <div className="save-btn--container">
      <button
        className="save-btn"
        onClick={handleSave}>
        Save
      </button>
    </div>
  )
}