import React from 'react';
import Api from './Api';
import '../styles/components/Apis.css';
import factory from '../factories/Apis.factory';

export default class Apis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apis: [],
      ongoingRequest: true,
      errorOnRequest: false
    };

    this.buildApisList = this.buildApisList.bind(this);
  }

  async componentDidMount() {
    try {
      const queriedApis = await factory.getApis();
      this.setState({
        apis: queriedApis,
        ongoingRequest: false
      });
    } catch (error) {
      console.log(error);
      this.setState({errorOnRequest: true})
    }
  }

  buildApisList(apis, ongoingRequest) {
    return (ongoingRequest)
      ? <div>Loading...</div>
      : apis.map((api) => (
          <Api key={api.id} api={api}/>
        )
    )
  }

  render() {
    const {apis, ongoingRequest, errorOnRequest} = this.state;
    const errorMessage = "Error loading APIS. Please, refresh the page";
    return (
      <div className="apis--container">
        <div className="apis--title">My APIs</div>
        <div className="apis--list">
          {(errorOnRequest)
            ? <div>{errorMessage}</div>
            : this.buildApisList(apis, ongoingRequest)
          }
        </div>
      </div>
      )
  }
}
