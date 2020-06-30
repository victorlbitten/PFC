import React from 'react';

export default class DetailsBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: this.props.api
    };
    this.changeName = this.changeName.bind(this);
  }

  changeName = (event) => {
    console.log(event);
    this.setState({
      api: {
        name: 'newName'
      } 
    })
  }

  render() {
    return (
      <Test api={this.state.api} clickEvent={this.changeName}/>
    )
  }
}

function Test({api, clickEvent}) {
  return (
    <div onClick={clickEvent}>
    API name: 
    </div>
  ) 
}