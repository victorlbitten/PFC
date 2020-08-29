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

const extractParsedObjectFromReturn = (requestResult) => (
  {
    is_json: requestResult.data[0].is_json,
    description: JSON.parse(requestResult.data[0].description)
  }
);

async function getDescriptionByApiId (apiId) {
  const url = `${urlBackend}/apis/${apiId}/app-description`;

  try {
    const requestResult = await axios.get(url);
    return extractParsedObjectFromReturn(requestResult);
  } catch (error) {
    throw new Error(`Couldn't load mapping for api with ID ${apiId}`);
  }
}

async function getApiDescriptionById (apiId) {
  const url = `${urlBackend}/apis/${apiId}/description`;

  try {
    const requestResult = await axios.get(url);
    return extractParsedObjectFromReturn(requestResult);
  } catch (error) {
    throw new Error(`Couldn't load mapping for api with ID ${apiId}`);
  }
}

async function saveApi (api, appDescription, apiDescription) {
  const url = `${urlBackend}/apis/${api.id}`;
  const requestConfigs = {
    method: 'put',
    url: url,
    data: {
      api,
      appDescription: appDescription,
      apiDescription: apiDescription
    }
  };
  try {
    await axios(requestConfigs);
    return;
  } catch (error) {
    throw new Error("Couldn't save API changes. Please, try again.")
  }
}

async function createApi (api, appDescription, apiDescription) {
  const apiToInsert = {
    name: api.name,
    method: api.method,
    url: api.url,
    isOpc: api.isOpc
  };
  const url = `${urlBackend}/apis`;
  const requestConfigs = {
    method: 'post',
    url: url,
    data: {
      api: apiToInsert,
      appDescription: appDescription,
      apiDescription: apiDescription
    }
  }

  try {
    const result = await axios(requestConfigs);
    return result.status;
  } catch (error) {
    throw new Error("Couldn't create API. Please, try again");
  }
}

async function deleteApi (apiId) {
  const url = `${urlBackend}/apis/${apiId}`;
  const response = await axios.delete(url);
  return response;
}

export {
  getApis,
  getDescriptionByApiId,
  getApiDescriptionById,
  saveApi,
  createApi,
  deleteApi
}