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
    this.onTargetSelection = this.onTargetSelection.bind(this);
    this.onOriginSelection = this.onOriginSelection.bind(this);

    this.state = {
      api: props.location.state,
      appDescription: {
        description: {},
        is_json: true
      },
      apiDescription: {
        description: {},
        is_json: true
      },
      ongoingRequest: true,
      errorOnRequest: false,
      newApi: (props.location.state.id==="create"),
      mappingEnvironment: {
        active: false,
        originElement: {},
        onOriginSelection: this.onOriginSelection,
        targetElement: {},
        onTargetSelection: this.onTargetSelection
      }
    };

  }

  async componentDidMount() {
    if (!this.state.newApi) {
      await getAppDescription(this);
      await getApiDescription(this);
    }
    this.setState({ongoingRequest: false});
  }

  onOriginSelection({element}) {
    this.setState((state) => {
      state.mappingEnvironment.active = true;
      state.mappingEnvironment.originElement = element;
      return {mappingEnvironment: state.mappingEnvironment}
    })
  }

  onTargetSelection({element}) {
    const originElement = this.state.mappingEnvironment.originElement;
    originElement.mapping = element.relativePath;
  }

  formEventsHandler(value, field) {
    this.setState((state) => {
      state.api[field] = value;
      return {api: state.api};
    })
  }

  render() {
    const {
      api,
      newApi,
      appDescription,
      apiDescription,
      ongoingRequest,
      errorOnRequest,
      mappingEnvironment
    } = this.state;
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
          newApi={newApi}
          mappingEnvironment={mappingEnvironment}
        />
      </div>
    )
  }
}

function DetailsContainer ({api, appDescription, apiDescription, show, formEventsHandler, newApi, mappingEnvironment}) {
  const LoadingMessage = () => (<div>Loading API details...</div>);

  const ShownComponents = ({api, appDescription, apiDescription, formEventsHandler}) => {
    return (
      <div>
        <DetailsHeader api={api} handler={formEventsHandler}/>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <Descriptions description={appDescription} mappingEnvironment={mappingEnvironment} isOrigin={true}/>
          <Descriptions description={apiDescription} mappingEnvironment={mappingEnvironment} isTarget={true}/>
        </div>
        <SaveButton api={api} appDescription={appDescription} apiDescription={apiDescription} newApi={newApi}/>
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
    });
  } catch (error) {
    classReference.setState({
      errorOnRequest: true
    })
  }
}

const getApiDescription = async (classReference) => {
  try {
    const queriedDescription = (classReference.state.newApi)
      ? {}
      : await getApiDescriptionById(classReference.state.api.id);
    classReference.setState({
      apiDescription: queriedDescription,
    });
  } catch (error) {
    classReference.setState({
      errorOnRequest: true
    })
  }
}