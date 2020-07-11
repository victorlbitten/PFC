import React from 'react';
import RedirectBtn from './RedirectBtn';
import DetailsHeader from './DetailsHeader';
import Descriptions from './Descriptions';
import SaveButton from './SaveButton';
import { getDescriptionByApiId, getApiDescriptionById } from '../factories/Apis.factory';
import '../styles/components/ApiDetails.css';

export default class ApiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.formEventsHandler = this.formEventsHandler.bind(this);

    this.state = {
      api: props.location.state,
      appDescription: {},
      apiDescription: {},
      ongoingRequest: true,
      errorOnRequest: false,
      newApi: (props.location.state.id==="create") 
    };

  }

  async componentDidMount() {
    await getAppDescription(this);
    await getApiDescription(this);
  }

  formEventsHandler(value, field) {
    this.setState((state) => {
      state.api[field] = value;
      return {api: state.api};
    })
  }

  render() {
    const {api, appDescription, apiDescription, ongoingRequest, errorOnRequest} = this.state;
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
          appDescription={appDescription}
          apiDescription={apiDescription}
          show={!ongoingRequest}
          formEventsHandler={this.formEventsHandler}
          newApi={this.state.newApi}
        />
      </div>
    )
  }
}

function DetailsContainer ({api, appDescription, apiDescription, show, formEventsHandler, newApi}) {
  const LoadingMessage = () => (<div>Loading API details...</div>);

  const ShownComponents = ({api, appDescription, apiDescription, formEventsHandler}) => {
    return (
      <div>
        <DetailsHeader api={api} handler={formEventsHandler}/>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Descriptions description={appDescription} />
          <Descriptions description={apiDescription} />
        </div>
        <SaveButton api={api} description={appDescription} newApi={newApi}/>
      </div>
    )
  };

  return (
    <div className="details-container">
      {
        (show)
          ? <ShownComponents
            api={api}
            appDescription={appDescription}
            apiDescription={apiDescription}
            formEventsHandler={formEventsHandler}
          />
          : <LoadingMessage />
      }
    </div>
  )
}

const getAppDescription = async (classReference) => {
  try {
    const queriedDescription = (classReference.state.newApi)
      ? {}
      : await getDescriptionByApiId(classReference.state.api.id);
    classReference.setState({
      appDescription: queriedDescription,
      ongoingRequest: false
    });
  } catch (error) {
    classReference.setState({
      ongoingRequest: false,
      errorOnRequest: true
    })
  }
}

const getApiDescription = async (classReference) => {
  try {
    const queriedDescription = (classReference.state.newApi)
      ? {}
      : await getApiDescriptionById(classReference.state.api.id);
      console.log(queriedDescription);
    classReference.setState({
      apiDescription: queriedDescription,
      ongoingRequest: false
    });
  } catch (error) {
    classReference.setState({
      ongoingRequest: false,
      errorOnRequest: true
    })
  }
}