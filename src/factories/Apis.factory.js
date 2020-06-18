import axios from 'axios';

async function getApis () {
  const requestResult = await axios.get('http://localhost:8000/apis');
  return requestResult.data;
}

export default {
  getApis
}