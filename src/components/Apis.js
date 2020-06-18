import React from 'react';
import '../styles/components/Apis.css';
import factory from '../factories/Apis.factory';

export default class Apis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {apis: []};
  }

  async componentDidMount() {
    const queriedApis = await factory.getApis();
    this.setState({apis: queriedApis});
  }

  render() {
    return <div>APIs</div>
  }
}
