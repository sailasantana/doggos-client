import React from 'react';
import './search-form.css'
import Results from '../results/results'
import { Link } from 'react-router-dom';
import config from '../config'
import DoggoContext from '../context'
import MapWrapped from '../map/map';
import Sidebar from '../sidebar/sidebar'
import TokenService from '../client-services/token'
import LogOut from '../loginSignup/logout'



export default class SearchForm extends React.Component {

    static contextType = DoggoContext;


    constructor(props){
        super(props)
        
        this.zipInput = React.createRef()
        this.typeInput = React.createRef()
        
        this.state = {
            clicked : false,
            places : []
        }
    }

    componentDidMount(){
        const token = TokenService.getAuthToken();
        const options = {
            method : 'GET',
            headers : {
                'session_token' : token
            }
        }

        fetch( `${config.API_ENDPOINT}/api/validate`, options )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }

                throw new Error( response.statusText );
            })
            .then( responseJson => {
                this.setState({
                    message : responseJson.message
                })
            })
            .catch( err => {
                console.log( err.message );
                this.props.history.push( '/login' );
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();


        const searchValues = {
            zip: this.zipInput.current.value,
            type: this.typeInput.current.value
           
           
        };
        //console.log(searchValues)
        console.log(TokenService.getAuthToken())
        fetch(`${config.API_ENDPOINT}/api/search`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'session_token': TokenService.getAuthToken()

        },
        body: JSON.stringify(searchValues)
        })
          .then(res => {
            if(!res.ok){
              return res.json().then(e => Promise.reject(e))
            }
            
             return res.json()
          })
          .then(places => {

            this.context.setLocations(places)
            this.setState({
                clicked : true,
                places: places} 
            );


          })
          .catch(error => {
              console.log(error)
        })


    }

    render(){
        return(
                <div>
                <Sidebar width={300} height={"100vh"}>
                <Link to ='./dashboard'>Your Dashboard</Link>
                <br></br>
                <br></br>
                <Link to ='./recommend'>Recommend A Business</Link>
                </Sidebar>
                <h1>Begin Your Search</h1>
                <form className ='form-container' onSubmit={this.handleSubmit}>
                <div className = "input">       
                <label for="fname" >Zip Code:</label>
                <input ref = {this.zipInput} type="text" id="zip" name="zip" defaultValue = "10011"/>
                </div>
                <div className = "input"> 
                <label for="type">Type of Activity:</label>
                <select ref = {this.typeInput} name="type" id="type">
                <option value="Parks">Parks</option>
                <option value="Bars">Bars</option>
                <option value="Restaurants">Restaurants</option>
                <option value="Pet Supplies">Pet Supplies</option>
                <option value="Veterinarian Services">Veterinarian Services</option>
                <option value="Dog Beaches">Beaches</option>
                <option value="Pet Hotels">Hotels</option>
                <option value="Groomers">Groomers</option>
                <option value="Hiking Trails"> Hiking Trails</option>
                <option value="Brunch">Brunch Spots</option>





                </select>
                </div>
                <input type="submit" value="Fetch!" className="button" />
                </form>
                <div className = "results"> {this.state.clicked ? <Results /> : null}</div>

               
                </div>
        )
    }
}
