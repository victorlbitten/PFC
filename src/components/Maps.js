import React from 'react';
import '../styles/components/Maps.css';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: this.props.maps
    }

    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChanges(element, elementCurrentName) {
    this.setState((state) => {
      const elementParent = getTargetElementParent(state, element);
      promoteElementChanges(state, element, elementCurrentName, elementParent);
      return {maps: state.maps};
    })
  }

  componentDidMount () {
    this.setState((state) => {
      appendAddButonToContainers(state.maps);
      return {maps: state.maps}
    })
  }

  render() {
    return (
      <div>
        <DrawMaps
          mapping={this.state.maps}
          addOrEdit={this.handleChanges}  
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
      })
      .sort((a) => sortAddBtnAsLast(a.props.elementInfo))}
    </div>
  )
}

function sortAddBtnAsLast (first) {
  return (first.type !== 'add')
    ? -1
    : 0

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
        onClick={() => addOrEdit(elementInfo, elementName)}>
          {(elementInfo.type === 'add')
            ? '+'
            : elementName
          }
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
    .sort((a) => sortAddBtnAsLast(a.props.elementInfo))
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
  const replacer = Object.assign({}, state.maps.sensor.mapping.name);
  elementCurrentName = 'NewName';

  const elementFormerName = element.relativePath[element.relativePath.length - 1];
  const elementNameHasChanged = (elementFormerName !== elementCurrentName);

  // Substituir os dados antigos pelos atuais
  elementParent[elementCurrentName] = replacer;
  
  if (element.type === 'add') {
    appendNewElement(elementParent, true);
    return;
  }

  if (elementNameHasChanged) {
    delete elementParent[elementFormerName];
  }
}

const appendAddButonToContainers = (maps) => {
  const typesToAppend = ['object', 'object_array'];

  const appendingIteration = (element) => {
    const isRoot = (!element.type);
    const shouldAppend = ((isRoot) || (typesToAppend.includes(element.type)));

    const getNextElement = () => {
      return (isRoot)
        ? element
        : element.mapping
    }

    if (shouldAppend) {
      const nextElement = getNextElement();
      Object.keys(nextElement).forEach((key) => appendingIteration(nextElement[key]));
      appendNewElement(element, isRoot);
    }
  }

  appendingIteration(maps);
}

const appendNewElement = (
  parentElement,
  isRoot=false,
  newElement={
    type:'add', mapping:{}}
  ) => {
    (isRoot)
      ? (parentElement.add = newElement)
      : (parentElement.mapping.add = newElement)
  }