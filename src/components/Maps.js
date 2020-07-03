import React from 'react';
import '../styles/components/Maps.css';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: this.props.maps
    }

    this.handleAddsAndEdits = this.handleAddsAndEdits.bind(this);
  }

  handleAddsAndEdits(element, elementCurrentName) {
    this.setState((state) => {
      const elementParent = getTargetElementParent(state, element);
      promoteElementChanges(state, element, elementCurrentName, elementParent);
      return {maps: state.maps};
    })
  }

  render() {
    return (
      <div>
        <DrawMaps
          mapping={this.state.maps}
          addOrEdit={this.handleAddsAndEdits}  
        />
      </div>
    )
  }
}

function DrawMaps ({mapping, addOrEdit}) {
  const initialDepth = 0;
  return (
    <div className="maps-container">
      {Object.entries(mapping).map(([name, values], index) => {
        return (
          <MapElement key={`${index}${initialDepth}`}
            addOrEdit={addOrEdit}
            elementName={name}
            elementInfo={values}
            depth={initialDepth}
          />
        )
      })}
    </div>
  )
}

function MapElement ({addOrEdit, elementName, elementInfo, depth, path=null}) {
  elementInfo.relativePath = (path)
    ? [...path, elementName]
    : [elementName];
  const shouldDrawSubmaps = (elementInfo.type !== 'property');
  const subMaps = (shouldDrawSubmaps)
    ? Object.entries(elementInfo.mapping)
    : null;
  
  return (
    <div className="map-elements-container">
      <div className="map-element"
        style={{'marginLeft': (20*depth + 'px')}}
        onClick={(event) => addOrEdit(elementInfo, elementName)}>
          {elementName}
      </div>

      {(shouldDrawSubmaps)
        ? <DrawSubmaps
          addOrEdit={addOrEdit}
          subMaps={subMaps}
          depth={depth}
          path={elementInfo.relativePath} 
        />
        : null
      }
    </div>
  )
}

function DrawSubmaps ({addOrEdit, subMaps, depth, path}) {
  return(
    subMaps.map(([name, values], index) => (
        <MapElement
        key={`${index}${depth}`}
        addOrEdit={addOrEdit}
        elementName={name}
        elementInfo={values}
        depth={depth+1}
        path={path}
      />
    ))
  )
}

const getTargetElementParent = (state, element) => {
  const getNextPath = (currentPath) => {
    const currentIndex = element.relativePath.indexOf(currentPath);
    const nextPathIndex = currentIndex + 1;
    return element.relativePath[nextPathIndex];
  }
  const getNextAccessor = (currentAccessor, currentPath) => (currentAccessor[currentPath].mapping);
  const getNextCount = (count) => (count - 1);
  
  const iterateTillElementParent = (accessor, path, count) => {
    if (count === 0) {
      return accessor;
    }
    
    const nextAccessor = getNextAccessor(accessor, path);
    const nextPath = getNextPath(path);
    const nextCount = getNextCount(count);

    return iterateTillElementParent(nextAccessor, nextPath, nextCount)
  }

  const elementRelativePath = element.relativePath;
  const numberOfIterations = (elementRelativePath.length - 1);
  const relativePathFirstStep = elementRelativePath[0];
  return iterateTillElementParent(state.maps, relativePathFirstStep, numberOfIterations);
}

const promoteElementChanges = (state, element, elementCurrentName, elementParent) => {
  // zueira -> Remover replacer e parâmetro state
  const replacer = Object.assign({}, state.maps.sensor.mapping.measures);
  elementCurrentName = 'NewName';

  const elementFormerName = element.relativePath[element.relativePath.length - 1];
  const elementNameHasChanged = (elementFormerName !== elementCurrentName);

  // Substituir os dados antigos pelos atuais
  elementParent[elementCurrentName] = replacer;

  if (elementNameHasChanged) {
    delete elementParent[elementFormerName];
  }
}