import React from 'react';
import RedirectBtn from './RedirectBtn';
import DetailsBody from './DetailsBody';
import { getMapsByApiId } from '../factories/Apis.factory';

export default class ApiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.location.state,
      mapping: {},
      ongoingRequest: true,
      errorOnRequest: false
    };
  }

  async componentDidMount() {
    try {
      const queriedMap = await getMapsByApiId(this.state.api.id);
      this.setState({
        mapping: queriedMap,
        ongoingRequest: false
      });
    } catch (error) {
      this.setState({
        ongoingRequest: false,
        errorOnRequest: true
      })
    }
  }

  render() {
    const {api, ongoingRequest, errorOnRequest} = this.state;
    return (
      <div className="container">
        <div className="container--title">
          {api.name}
          <RedirectBtn destination="/" />
        </div>
        {(ongoingRequest)
          ? <span>Loading API details...</span>
          : <DetailsBody api={api}/>
        }
      </div>
    )
  }
}