import React from 'react';

export default function ApiDetail({location: {state}}) {
  const api = state;
  return (
    <div className="container">
      <div className="container--title">API Details</div>
      <div>
        API name: {api.name}
      </div>
    </div>
  );
}