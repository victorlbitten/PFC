import React from 'react';
import MapElement from './MapElement';
import '../styles/components/Maps.css';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: this.props.maps
    }

    this.handleChanges = this.handleChanges.bind(this);
    this.deleteMap = this.deleteMap.bind(this);
  }

  handleChanges(element, elementCurrentName) {
    this.setState((state) => {
      const elementParent = getTargetElementParent(state, element);
      promoteElementChanges(element, elementCurrentName, elementParent);
      return {maps: state.maps};
    })
  }

  componentWillMount () {
    this.setState((state) => {
      appendAddButonToContainers(state.maps);
      return {maps: state.maps}
    })
  }

  deleteMap({name, element}) {
    const parentElement = getTargetElementParent(this.state, element);
    this.setState((state) => {
      delete parentElement[name];
      return {maps: state.maps}
    })
  }

  render() {
    return (
      <div>
        <DrawMaps
          mapping={this.state.maps}
          addOrEdit={this.handleChanges}  
          deleteMap={this.deleteMap}
        />
      </div>
    )
  }
}

function DrawMaps ({mapping, addOrEdit, deleteMap}) {
  const drawMapElements = (element, depth=0, path=null) => {
    const elementsToDraw = Object.entries(element);
    return elementsToDraw.map((element, index) => {
      const getElementProperties = (element, depth) => {
        // Definição de constantes e métodos
        const elementType = element[1].type;
        const containerizedTypes = ['object', 'object_array'];
        const isContainerizedElement = containerizedTypes.includes(elementType);
        const elementKey = `${index}${depth}${Math.random()}`;

        return [isContainerizedElement, elementKey];
      }

      const setElementPath = (path) => {
        element[1].relativePath = (path)
          ? [...path, element[0]]
          : [element[0]];
      }

      const [isContainerizedElement, elementKey] = getElementProperties(element, depth);

      const containerizedElement = (elementKey, element) => {
        return (
          <div className="containerized-type" key={elementKey}>
            <MapElement
              element={element}
              depth={depth}
              saveChanges={addOrEdit}
              deleteMap={deleteMap}
            />
            {drawMapElements(element[1].mapping, depth + 1, element[1].relativePath)}
          </div>
        )
      }

      const nonContainerizedElement = (elementKey, element) => {
        return (
          <MapElement key={elementKey} 
            element={element}
            depth={depth}
            saveChanges={addOrEdit}
            deleteMap={deleteMap}
          />
        )
      }

      // Chamadas a métodos e função em si
      setElementPath(path);

      return (isContainerizedElement)
        ? containerizedElement(elementKey, element)
        : nonContainerizedElement(elementKey, element);
    })
  }
  return drawMapElements(mapping);
}

function sortAddBtnAsLast (first) {
  return (first.type !== 'add')
    ? -1
    : 0

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

const promoteElementChanges = (element, elementCurrentName, elementParent) => {
  const elementFormerName = element.relativePath[element.relativePath.length - 1];
  const elementNameHasChanged = (elementFormerName !== elementCurrentName);

  // Substituir os dados antigos pelos atuais
  elementParent[elementCurrentName] = element;
  
  if (elementNameHasChanged) {
    delete elementParent[elementFormerName];
  }

  if (element.isNewElement) {
    appendNewElement(elementParent, true);
    delete element.isNewElement;
  }

  if(['object', 'object_array'].includes(element.type)) {
    if(!Object.keys(element.mapping).length) {
      appendNewElement(element, false);
    }
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