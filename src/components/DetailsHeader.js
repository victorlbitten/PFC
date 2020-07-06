import React from 'react';
import '../styles/components/DetailsHeader.css';

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
    const { api } = this.state;
    const fields = [
      {name: 'name', title: 'Name'},
      {name: 'method', title: 'Method'},
      {name: 'url', title: 'URL'}
    ];
    const defaultValues = {
      name: (api.name !== '+') ? api.name : '',
      method: api.method || '',
      url: api.url || ''
    }

    return (
      <form onSubmit={this.handleSubmit}
        className="form-container">
        {fields.map((field, index) =>
          <label key={index}
            className="header-label">
            <span className="header-label-text">{field.title}: </span>
            <input
              className="header-input"
              type="text"
              defaultValue={defaultValues[field.name]}
              onChange={(event) => this.handleChange(event, field.name)}
              autoFocus={index===0}
            />
          </label>
        )}
        <button type="submit" style={{'display': 'none'}} />
      </form>  
    )
  }
}