import React from 'react';
import RedirectBtn from './RedirectBtn';

export default class ApiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.location.state
    };
  }

  render() {
    const api = this.state.api;
    return (
      <div className="container">
      <div className="container--title">
        API Details
        <RedirectBtn destination="/" />
      </div>
        <div>
          API name: {api.name}
        </div>
    </div>
    )
  }
}