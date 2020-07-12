import React from 'react';
import '../styles/components/SaveButton.css';
import { saveApi, createApi } from '../factories/Apis.factory';

export default function SaveButton ({api, appDescription, apiDescription, newApi}) {
  function createNewApi () {
    try {
      createApi(api, appDescription, apiDescription)
    } catch(error) {
      console.log(error);
    }
  }

  function saveEditions () {
    try {
      saveApi(api, appDescription, apiDescription);
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