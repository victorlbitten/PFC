import axios from 'axios';
import { urlBackend } from '../constants/configs';

async function saveMap (map) {
  const url = `${urlBackend}/apis/${api.id}`;
  const requestConfigs = {
    method: 'put',
    url: url,
    data: {
      name: api.name,
      url: api.url,
      method: api.method
    }
  };
  try {
    await axios(requestConfigs);
    return;
  } catch (error) {
    throw new Error("Couldn't save API changes. Please, try again.")
  }
}

export {
  saveMap
}