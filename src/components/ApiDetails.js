import React from 'react';

export default function ApiDetail({location: {state}}) {
  const api = state;
  return (
    <div>API name: {api.name}</div>
  );
}