import React from 'react';
import '../styles/components/MapElement.css';

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
  }

  toggleEditMode() {
    this.setState((previousState) => ({isEditing: !previousState.isEditing}));
  }

  saveEditions(elementToSave) {
    const isNestable = ['object', 'object_array'].includes(elementToSave.element.type);
    const addEmptyMapping = (
      elementToSave.isNewElement || (
        isNestable && (
          Array.isArray(elementToSave.element.mapping) ||
          !Object.keys(elementToSave.element.mapping).length
        )
      )
    )
    if (addEmptyMapping) {
      elementToSave.element.mapping = {};
    }

    this.setState({
      element: elementToSave,
      isEditing:false
    }, () => this.props.saveChanges(this.state.element.element, this.state.element.name));
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
          : (
            <div className="map-element"
              onClick={this.toggleEditMode}>
                {(this.state.element.name === 'add')
                  ? '+'
                  : this.state.element.name
                }
            </div>
          )
        }
      </div>
    )
  }
}

const getElementStyles = (depth) => ({
  marginLeft: 15*depth + 'px'
})

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
  return (
    <form onSubmit={handleSubmission}>
      <label>
        Name:
        <input
          defaultValue={element.name}
          name={'name'}/>
      </label>
      <label>
        Type
        <input
          defaultValue={element.element.type}
          name={'type'}/>
      </label>
      <button type={'submit'} style={{display: 'none'}}/>
    </form>
  )
}




















// function MapElement ({addOrEdit, elementName, elementInfo, depth, path=null}) {
  // elementInfo.relativePath = (path)
  //   ? [...path, elementName]
  //   : [elementName];
//   const shouldDrawSubmaps = (elementInfo.type !== 'property');
//   const subMaps = (shouldDrawSubmaps)
//     ? Object.entries(elementInfo.mapping)
//     : null;
  
//   return (
//     <div className="map-elements-container">
//       <div className="map-element"
//         style={{'marginLeft': (20*depth + 'px')}}
//         onClick={() => addOrEdit(elementInfo, elementName)}>
//           {(elementInfo.type === 'add')
//             ? '+'
//             : elementName
//           }
//       </div>

//       {(shouldDrawSubmaps)
//         ? <DrawSubmaps
//           addOrEdit={addOrEdit}
//           subMaps={subMaps}
//           depth={depth}
//           path={elementInfo.relativePath} 
//         />
//         : null
//       }
//     </div>
//   )
// }

// function DrawSubmaps ({addOrEdit, subMaps, depth, path}) {
//   return(
//     subMaps.map(([name, values], index) => (
//         <MapElement
//         key={`${index}${depth}`}
//         addOrEdit={addOrEdit}
//         elementName={name}
//         elementInfo={values}
//         depth={depth+1}
//         path={path}
//       />
//     ))
//     .sort((a) => sortAddBtnAsLast(a.props.elementInfo))
//   )
// }