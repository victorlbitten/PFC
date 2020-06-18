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

export default {
  getApis
}