import axios from 'axios';
import { urlBackend } from '../constants/configs';

async function getApis () {
  const url = `${urlBackend}/apis`;
  try {
    const requestResult = await axios.get(url);
    return requestResult.data;
  } catch (error) {
    throw new Error("Couldn't load APIs")
  }
}

async function getMapsByApiId (apiId) {
  const url = `${urlBackend}/apis/${apiId}/mapping`;
  const extractParsedObjectFromReturn = (requestResult) => (
    JSON.parse(requestResult.data[0].mapping)
  );

  try {
    const requestResult = await axios.get(url);
    return extractParsedObjectFromReturn(requestResult);
  } catch (error) {
    throw new Error(`Couldn't load mapping for api with ID ${apiId}`);
  }
}

async function saveApi (api, mapping) {
  const url = `${urlBackend}/apis/${api.id}`;
  const requestConfigs = {
    method: 'put',
    url: url,
    data: {
      api: {
        name: api.name,
        url: api.url,
        method: api.method
      },
      mapping: mapping
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
  getApis,
  getMapsByApiId,
  saveApi
}