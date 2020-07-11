import React, { useState } from 'react';
import classNames from 'classnames';
import '../styles/components/DescriptionElement.css';

export default class MapElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      element: {
        name: props.element[0],
        element: props.element[1]
      },
      isEditing: false
    }

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.saveEditions = this.saveEditions.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  toggleEditMode() {
    this.setState((previousState) => ({isEditing: !previousState.isEditing}));
  }

  saveEditions(elementToSave) {
    const isNestable = ['object', 'object_array'].includes(elementToSave.element.type);
    const addEmptyDescription = (
      elementToSave.isNewElement || (
        isNestable && (
          Array.isArray(elementToSave.element.description) ||
          !Object.keys(elementToSave.element.description).length
        )
      )
    )
    if (addEmptyDescription) {
      elementToSave.element.description = {};
    }

    this.setState({
      element: elementToSave,
      isEditing:false
    }, () => this.props.saveChanges(this.state.element.element, this.state.element.name));
  }

  handleDelete() {
    this.props.deleteDescriptionElement({
      name: this.state.element.name,
      element: this.state.element.element
    });
  }

  render() {
    const { depth } = this.props;
    const { element, isEditing } = this.state;

    return (
      <div style={getElementStyles(depth)}>
        {(isEditing)
          ? <EditionElement
              element={element}
              saveEditions={this.saveEditions}
              />
          : <DescriptiveElement
              element={this.state.element}
              toggleEdit={this.toggleEditMode}
              handleDelete={this.handleDelete}  
            />
        }
      </div>
    )
  }
}

const getElementStyles = (depth) => ({
  marginLeft: 15*depth + 'px'
})

function DescriptiveElement ({element, toggleEdit, handleDelete}) {
  const shouldShowDelete = (element.name !== 'add');
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="description-element"
      onMouseEnter={() => setShowDelete(shouldShowDelete)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={toggleEdit}>
        <div>
          {(element.element.type === "add")
            ? '+'
            : element.name
          }
        </div>
        {showDelete && (
          <div className="delete-description-btn" onClick={handleDelete}>
            x
          </div>
        )}
    </div>
  )
}

function EditionElement ({element, saveEditions}) {
  if (element.element.type === 'add') {
    element.element.isNewElement = true;
  }

  function handleSubmission (event) {
    event.preventDefault();
    element.name = event.target.getElementsByTagName('input').name.value;
    element.element.type = event.target.getElementsByTagName('input').type.value;
    
    saveEditions(element);
  }

  const inputFields = [
    {name: 'name', title: 'Name', autoFocus: true},
    {name: 'type', title: 'Type'}
  ]

  const defaultValues = {
    name: (element.name !== 'add') ? element.name : '',
    type: (element.element.type !== 'add') ? element.element.type : ''
  };

  return (
    <div className="description-form-container">
      <form onSubmit={handleSubmission} className="description-form">
        {inputFields.map((field) => (
          <label className="description-form-label" key={Math.random()}>
            <span className="description-label-text">{ field.title }</span>
            <input className={classNames({
              'description-form-input': true,
              'description-form-type-input': (field.name === 'type')
              })}
              spellCheck={false}
              autoFocus={field.autoFocus}
              defaultValue={defaultValues[field.name]}
              name={field.name}/>
          </label>
        ))}
        <button type={'submit'} style={{display: 'none'}}/>
      </form>
    </div>
  )
}

