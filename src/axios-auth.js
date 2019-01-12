import axios from 'axios'

const musixInstance = axios.create({
  baseURL: 'https://musixmatchcom-musixmatch.p.rapidapi.com/wsr/1.1',
  headers: {'X-RapidAPI-Key': 'e2d10c32a5msh6454ff7b36e22c0p1604e2jsn6b925e838c67'}
})

//headers.get for get request
//headers.post for post request
//headers.common for all type
//musixInstance.defaults.headers.get['Accepts'] = 'application/jsonss'


export default musixInstance