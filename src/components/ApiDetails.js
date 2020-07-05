import React from 'react';
import RedirectBtn from './RedirectBtn';
import DetailsHeader from './DetailsHeader';
import Maps from './Maps';
import SaveButton from './SaveButton';
import { getMapsByApiId } from '../factories/Apis.factory';
import '../styles/components/ApiDetails.css';

export default class ApiDetail extends React.Component {
  constructor(props) {
    super(props);
    this.formEventsHandler = this.formEventsHandler.bind(this);

    this.state = {
      api: props.location.state,
      mapping: {},
      ongoingRequest: true,
      errorOnRequest: false
    };

    this.show = this.show.bind(this);
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

  formEventsHandler(value, field) {
    this.setState((state) => {
      state.api[field] = value;
      return {api: state.api};
    })
  }

  show() {
    console.log(this.state.mapping)
  }
  

  render() {
    const {api, mapping, ongoingRequest, errorOnRequest} = this.state;
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
          mapping={mapping}
          show={!ongoingRequest}
          formEventsHandler={this.formEventsHandler}
        />
        <button onClick={this.show}>Show</button>
      </div>
    )
  }
}

function DetailsContainer ({api, mapping, show, formEventsHandler}) {
  const LoadingMessage = () => (<div>Loading API details...</div>);

  const ShownComponents = ({api, mapping, formEventsHandler}) => {
    return (
      <div>
        <DetailsHeader api={api} handler={formEventsHandler}/>
        <Maps maps={mapping} />
        <SaveButton api={api} mapping={mapping}/>
      </div>
    )
  };

  return (
    <div className="details-container">
      {
        (show)
          ? <ShownComponents
            api={api}
            mapping={mapping}
            formEventsHandler={formEventsHandler}
          />
          : <LoadingMessage />
      }
    </div>
  )
}