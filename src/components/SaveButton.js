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
    deleteAddEntries();
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

    function deleteAddEntries () {
      const keyToDelete = 'add';
      const expansibleTypes = ['object', 'object_array'];
      const deletionIteration = (referenceObject) => {
        Object.keys(referenceObject).forEach((currentKey) => {
          if (currentKey === keyToDelete) {
            delete referenceObject[currentKey];
            return;
          }

          if (expansibleTypes.includes(referenceObject[currentKey].type)) {
            deletionIteration(referenceObject[currentKey].description);
          }
        })
      }

      deletionIteration(apiDescription.description);
      deletionIteration(appDescription.description);
    }

}