import React from 'react';
import Api from './Api';
import '../styles/components/Apis.css';
import { getApis } from '../factories/Apis.factory';

export default class Apis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apis: [],
      ongoingRequest: true,
      errorOnRequest: false
    };

    this.buildApisList = this.buildApisList.bind(this);
    this.handleApiDeletion = this.handleApiDeletion.bind(this);
  }

  async componentDidMount() {
    const addButtonApi = {
      id: 'create',
      method: null,
      name: '+',
      url: ''
    };
    try {
      const queriedApis = await getApis();
      this.setState({
        apis: [...queriedApis, addButtonApi],
        ongoingRequest: false
      });
    } catch (error) {
      console.log(error);
      this.setState({errorOnRequest: true})
    }
  }

  handleApiDeletion(apiId) {
    const indexOfApiToRemove = (this.state.apis.findIndex(({id}) => apiId === id));
    this.setState((state) => {
      state.apis.splice(indexOfApiToRemove, 1);
      return {apis: state.apis}
    });
  }

  buildApisList(apis, ongoingRequest) {
    return (ongoingRequest)
      ? <div>Loading...</div>
      : apis.map((api) => (
          <Api key={api.id} api={api} onDelete={this.handleApiDeletion}/>
        )
    )
  }

  render() {
    const {apis, ongoingRequest, errorOnRequest} = this.state;
    const errorMessage = "Error loading APIS. Please, refresh the page";
    return (
      <div className="container">
        <div className="container--title">My APIs</div>
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
