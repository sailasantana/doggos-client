import LoginPage from './loginSignup/login-page';
import SignUp from './loginSignup/sign-up';
import {Route} from 'react-router-dom';
import Favorites from './favorites/favorites';
import Recommend from './recommend/recommend';
import DoggoContext from './context';
import React from 'react';
import SearchForm from './search/search';
import TokenService from './client-services/token';
import config from './config';
import { withRouter } from 'react-router-dom';
import './App.css';


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      places : [],
      user_name: '',
      savedSpots : [],
      detailsToDisplay: [],
      currentZip: ''
    }
  }

  componentDidMount( ){

    let user_name = localStorage.getItem('user_name')
    
    this.setState({user_name:user_name})

    fetch(`${config.API_ENDPOINT}/api/${user_name}/dashboard`, {
      headers: {
        'session_token':`${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok){
        return res.json().then(e => Promise.reject(e))
      }
      
      return res.json()
    })

    .then(spots => {
      
      this.setUserSpots(spots)
    })
    .catch(error => {
      console.log('Disregard the 401 above. I am deliberately triggering a fetch call that stores username into local storage. This is so that when a user refreshes the browser (which causes context to be reset) the app does not lose reference to the logged in.')
      this.props.history.push('/')
    })
  }

  getPlaces = (places) => {
    this.setState({places: places })
  }

  updateUserName = (user) => {
    this.setState({user_name: user})
    
  }

  setUserSpots = spots => {
    this.setState({savedSpots : spots})

  }


  addToSaved = (spot) => {
    this.setState({ savedSpots: [...this.state.savedSpots, spot]})
  }

  deleteSpot = (id) => {
    const { savedSpots } = this.state
 
    this.setState({
      savedSpots: savedSpots.filter (spot => {
        return spot.id !== id
      })
    })

  }

  setCurrentZip = (zip) => {
    this.setState({currentZip: zip})

  }

  render(){

    const contextValues = {
      locations: this.state.places,
      setLocations : this.getPlaces,
      user_name : this.state.user_name,
      setUserName : this.updateUserName,
      savedSpots : this.state.savedSpots,
      addToSaved : this.addToSaved,
      setUserSpots : this.setUserSpots,
      deleteSpot : this.deleteSpot,
      currentZip: this.state.currentZip,
      setCurrentZip: this.setCurrentZip      
    }
  

  return (

    <DoggoContext.Provider value={contextValues}>

    <div className="App">
      <Route exact path='/' component={LoginPage} />
      <Route path='/sign-up' component={SignUp} />
      <Route path='/search' component={SearchForm} />
      <div className = "dashboard-view">
      <Route path='/dashboard' component={Favorites} />
      </div>
      <Route path='/recommend' component={Recommend} />
    </div>
    </ DoggoContext.Provider >

    )

  } 
}


export default withRouter(App);
