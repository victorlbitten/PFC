import React from 'react';

export default function SaveButton ({api, mapping}) {
  const saveChanges = () => {
    console.log(api);
  };
  return (
    <button onClick={saveChanges()}>Save</button>
  )
}