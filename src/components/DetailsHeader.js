import React from 'react';

export default class DetailsHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: this.props.api
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const fields = Object.keys(this.state.api);
    fields.forEach((field) => {
      this.props.handler(this.state.api[field], field);
    })
  }

  handleChange = (event, field) => {
    event.persist();
    this.setState((state) => {
      state.api[field] = event.target.value;
      return ({api: state.api})
    })
  }

  render() {
    const fields = [
      {name: 'name', title: 'Name'},
      {name: 'method', title: 'Method'},
      {name: 'url', title: 'URL'}
    ];
    return (
      <form onSubmit={this.handleSubmit}>
        {fields.map((field, index) =>
          <label key={index}>
            {field.title}: 
            <input
              type="text"
              defaultValue={this.state.api[field.name]}
              onChange={(event) => this.handleChange(event, field.name)}
            />
          </label>
        )}
        <button type="submit" style={{'display': 'none'}} />
      </form>  
    )
  }
}