import React from 'react';
import '../styles/components/SaveButton.css';
import { saveApi } from '../factories/Apis.factory';

export default function SaveButton ({api, mapping}) {
  const saveChanges = () => {
    try {
      saveApi(api, mapping);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="save-btn--container" onClick={saveChanges}>
      <button
        className="save-btn">
        Save
      </button>
    </div>
  )
}