import React from 'react';
import RedirectBtn from './RedirectBtn';
import DetailsHeader from './DetailsHeader';
import Descriptions from './Descriptions';
import SaveButton from './SaveButton';
import { getDescriptionByApiId } from '../factories/Apis.factory';
import '../styles/components/ApiDetails.css';

export default class ApiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.formEventsHandler = this.formEventsHandler.bind(this);

    this.state = {
      api: props.location.state,
      description: {},
      ongoingRequest: true,
      errorOnRequest: false,
      newApi: (props.location.state.id==="create") 
    };

  }

  async componentDidMount() {
    try {
      const queriedDescription = (this.state.newApi)
        ? {}
        : await getDescriptionByApiId(this.state.api.id);
      this.setState({
        description: queriedDescription,
        ongoingRequest: false
      });
    } catch (error) {
      this.setState({
        ongoingRequest: false,
        errorOnRequest: true
      })
    }
  }

  formEventsHandler(value, field) {
    this.setState((state) => {
      state.api[field] = value;
      return {api: state.api};
    })
  }

  render() {
    const {api, description, ongoingRequest, errorOnRequest} = this.state;
    if (errorOnRequest) {
      return <div>Error loading API details. Please, refresh page.</div>
    }

    return (
      <div className="container">
        <div className="container--title">
          API details
          <RedirectBtn destination="/" />
        </div>
        <DetailsContainer
          api={api}
          description={description}
          show={!ongoingRequest}
          formEventsHandler={this.formEventsHandler}
          newApi={this.state.newApi}
        />
      </div>
    )
  }
}

function DetailsContainer ({api, description, show, formEventsHandler, newApi}) {
  const LoadingMessage = () => (<div>Loading API details...</div>);

  const ShownComponents = ({api, description, formEventsHandler}) => {
    return (
      <div>
        <DetailsHeader api={api} handler={formEventsHandler}/>
        <Descriptions description={description} />
        <SaveButton api={api} description={description} newApi={newApi}/>
      </div>
    )
  };

  return (
    <div className="details-container">
      {
        (show)
          ? <ShownComponents
            api={api}
            description={description}
            formEventsHandler={formEventsHandler}
          />
          : <LoadingMessage />
      }
    </div>
  )
}