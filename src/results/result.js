import React from 'react';
import {Link} from 'react-router-dom'
import TokenService from '../client-services/token';
import config from '../config'
import DoggoContext from '../context'
import './result.css'




export default class Result extends React.Component {

    static contextType = DoggoContext

    constructor(props){
        super(props)

        this.state = {
            error : null,
            selectedPlaceId: '',
            learnMore:false,
            results : []
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
                alert('Please log back in to continue');
                this.props.history.push( '/' );
            });
    }

   

    handleAdd = (e) => {
     
        let newSpot = {
            title : this.props.title,
            doggoaddress: this.props.address
        }

       fetch(`${config.API_ENDPOINT}/api/${this.context.user_name}/dashboard`,  {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'session_token': TokenService.getAuthToken()
        },
        body: JSON.stringify(newSpot),
        })
        .then(res => {
            if(!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            alert('Doggo Spot Successfully Added')
            return res.json()
        })
        .then(spot => {
            this.context.addToSaved(spot)
        })
        .catch(error => {
            alert({error})
        })
    }

    handleGet = (event) => {
        const place_id = event.target.value;
        this.setState({selectedPlaceId:place_id})
        this.setState({learnMore:true})


     
        fetch(`${config.API_ENDPOINT}/api/details/${place_id}`,  {
         method: 'GET',
         headers: {
             'content-type': 'application/json',
             'session_token': TokenService.getAuthToken()
         }
         })
         .then(res => {
             
             if(!res.ok){
                 return res.json().then(e => Promise.reject(e))
             }
             return res.json()
         })
         .then(details => {
            
             this.setState({results:details})
            })
         .catch(error => {
             alert({error})
         })
    }


    handleClick = (event) => {
        this.setState({learnMore:false})
    }
    

    render () {  
      const {title , address, overall_rating, place_id, id} = this.props;
      
        return (
        <div className='Result'>

          <h2 className='Result_title' id='Result_title' name='Result_title'>
            
              {title}
          
          </h2>
          <p className='Result_address' id ="Result_address" name = "Result_address">
            
            {address}
        
          </p>
          <p className='Result_rating'>
            
            Overall Rating: {overall_rating}
        
          </p>
          <div className = 'buttons-containter'>
          <button 
            className='details-button' 
            onClick = {this.handleGet}
            type='button' 
            value = {place_id}>           
            Learn More
         </button>
        
          {this.state.results.result && this.state.learnMore ? 
                        <div className = "learn-more-container">
                        <a href= {this.state.results.result.website} className = "detail learn-more-website">{this.state.results.result.website}</a>
                        <p className = "detail learn-more-number">{this.state.results.result.formatted_phone_number}</p>
                        <ul className = "detail learn-more-reviews"> 
                            <li className = "learn-more-review">"{this.state.results.result.reviews[0].text}" - {this.state.results.result.reviews[0].author_name} </li>
                            <li className = "learn-more-review">"{this.state.results.result.reviews[2].text}" - {this.state.results.result.reviews[2].author_name} </li>
                            <li className = "learn-more-review">"{this.state.results.result.reviews[4].text}" - {this.state.results.result.reviews[4].author_name} </li>
                        </ul>
                        <button className = "learn-more-button" onClick = {this.handleClick}>x</button>
        
                        </div> : null}


          <button 
            className='add-button' 
            onClick = {this.handleAdd}
            type='button'>
           
            Add To Doggo Board

          </button>
          
          </div>
        
         
        </div>
      )
    }
  }