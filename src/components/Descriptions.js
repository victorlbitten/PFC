import React from 'react';
import DescriptionElement from './DescriptionElement';
import '../styles/components/Descriptions.css';

export default class Descriptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: this.props.description
    }

    this.handleChanges = this.handleChanges.bind(this);
    this.deleteDescriptionElement = this.deleteDescriptionElement.bind(this);
  }

  handleChanges(element, elementCurrentName) {
    this.setState((state) => {
      const elementParent = getTargetElementParent(state, element);
      promoteElementChanges(element, elementCurrentName, elementParent);
      return {description: state.description};
    })
  }

  componentWillMount () {
    this.setState((state) => {
      appendAddButonToContainers(state.description);
      return {description: state.description}
    })
  }

  deleteDescriptionElement({name, element}) {
    const parentElement = getTargetElementParent(this.state, element);
    this.setState((state) => {
      delete parentElement[name];
      return {description: state.description}
    })
  }

  render() {
    const {mappingEnvironment, isOrigin, isTarget} = this.props;
    return (
      <div style={{flexGrow: 1}}>
      <DrawDescription
        description={this.state.description}
        addOrEdit={this.handleChanges}  
        deleteDescriptionElement={this.deleteDescriptionElement}
        mappingEnvironment={mappingEnvironment}
        isOrigin={isOrigin}
        isTarget={isTarget}
      />
    </div>
    )
  }
}

function DrawDescription ({
  description,
  addOrEdit,
  deleteDescriptionElement,
  mappingEnvironment,
  isOrigin,
  isTarget
}) {
  const drawDescriptionElements = (element, depth=0, path=null) => {
    const elementsToDraw = Object.entries(element);
    return elementsToDraw.map((element) => {
      const getElementProperties = (element, depth) => {
        // Definição de constantes e métodos
        const elementType = element[1].type;
        const containerizedTypes = ['object', 'object_array'];
        const isContainerizedElement = containerizedTypes.includes(elementType);
        const elementKey = `${depth}${Math.random()}`;

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
            <DescriptionElement
              element={element}
              depth={depth}
              saveChanges={addOrEdit}
              deleteDescriptionElement={deleteDescriptionElement}
              mappingEnvironment={mappingEnvironment}
              isOrigin={isOrigin}
              isTarget={isTarget}
            />
            {drawDescriptionElements(element[1].description, depth + 1, element[1].relativePath)}
          </div>
        )
      }

      const nonContainerizedElement = (elementKey, element) => {
        return (
          <DescriptionElement key={elementKey} 
            element={element}
            depth={depth}
            saveChanges={addOrEdit}
            deleteDescriptionElement={deleteDescriptionElement}
            mappingEnvironment={mappingEnvironment}
            isOrigin={isOrigin}
            isTarget={isTarget}
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
  return drawDescriptionElements(description);
}

const getTargetElementParent = (state, element) => {
  const getNextPath = (currentPath) => {
    const currentIndex = element.relativePath.indexOf(currentPath);
    const nextPathIndex = currentIndex + 1;
    return element.relativePath[nextPathIndex];
  }
  const getNextAccessor = (currentAccessor, currentPath) => (currentAccessor[currentPath].description);
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
  return iterateTillElementParent(state.description, relativePathFirstStep, numberOfIterations);
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
    if(!Object.keys(element.description).length) {
      appendNewElement(element, false);
    }
  }
}

const appendAddButonToContainers = (description) => {
  const typesToAppend = ['object', 'object_array'];

  const appendingIteration = (element) => {
    const isRoot = (!element.type);
    const shouldAppend = ((isRoot) || (typesToAppend.includes(element.type)));

    const getNextElement = () => {
      return (isRoot)
        ? element
        : element.description
    }

    if (shouldAppend) {
      const nextElement = getNextElement();
      Object.keys(nextElement).forEach((key) => appendingIteration(nextElement[key]));
      appendNewElement(element, isRoot);
    }
  }

  appendingIteration(description);
}

const appendNewElement = (
  parentElement,
  isRoot=false,
  newElement={
    type:'add', description:{}}
  ) => {
    (isRoot)
      ? (parentElement.add = newElement)
      : (parentElement.description.add = newElement)
  }