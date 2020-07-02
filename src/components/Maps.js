import React from 'react';
import '../styles/components/Maps.css';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maps: this.props.maps
    }
    console.log(this.state.maps);

    this.handleEdits = this.handleEdits.bind(this);
    this.show = this.show.bind(this);
  }

  handleEdits({name, info}) {
    const getNextPath = (currentPath) => {
      const currentIndex = info.relativePath.indexOf(currentPath);
      return info.relativePath[currentIndex + 1];
    }

    const change = (accessor, target, path, replacer, count) => {
      if (!(count > 0)) {
        const replace = (name === target);
        if (replace) {
          accessor[target] = replacer;
        } else {
          delete accessor[target];
          accessor[name] = replacer
        }
        return;
      }
      change(accessor[path].mapping, target, getNextPath(path), replacer, count-1)
    }

    const { relativePath } = info;
    const targetedProperty = relativePath.pop();
    name = 'newProperty';
    this.setState((state) => {
      const replacer = Object.assign({}, state.maps.sensor.mapping.name);
      change(state.maps, targetedProperty, relativePath[0], replacer, relativePath.length);
      return {maps: state.maps}
    })
  }

  show() {
    console.log(this.state.maps);
  }

  render() {
    return (
      <div>
        <DrawMaps
          mapping={this.state.maps}
          handler={this.handleEdits}  
        />
        <button onClick={this.show}>Show</button>
      </div>
    )
  }
}

function DrawMaps ({mapping, handler}) {
  const initialDepth = 0;
  return (
    <div className="maps-container">
      {Object.entries(mapping).map(([name, values], index) => {
        return (
          <MapElement key={`${index}${initialDepth}`}
            handler={handler}
            elementName={name}
            elementInfo={values}
            depth={initialDepth}
          />
        )
      })}
    </div>
  )
}

function MapElement ({handler, elementName, elementInfo, depth, path=null}) {
  elementInfo.relativePath = (path)
    ? [...path, elementName]
    : [elementName];
  const shouldDrawSubmaps = (elementInfo.type !== 'property');
  const subMaps = (shouldDrawSubmaps)
    ? Object.entries(elementInfo.mapping)
    : null;
  
  const changeName = (event, element) => {
    handler(element);
  }

  return (
    <div className="map-elements-container">
      <div className="map-element"
        style={{'marginLeft': (20*depth + 'px')}}
        onClick={(event) => changeName(event, {name:elementName, info:elementInfo})}>
          {elementName}
      </div>

      {(shouldDrawSubmaps)
        ? <DrawSubmaps
          handler={handler}
          subMaps={subMaps}
          depth={depth}
          path={elementInfo.relativePath} 
        />
        : null
      }
    </div>
  )
}

function DrawSubmaps ({handler, subMaps, depth, path}) {
  return(
    subMaps.map(([name, values], index) => (
        <MapElement
        key={`${index}${depth}`}
        handler={handler}
        elementName={name}
        elementInfo={values}
        depth={depth+1}
        path={path}
      />
    ))
  )
}