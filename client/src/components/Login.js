import React, { Component } from 'react'
import { login } from './UserFunctions'
import Navbar from './Navbar'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const { email, password, errors } = this.state;
  
    fetch(`${document.location.origin}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})
    }).then(response => response.json())
    .then(json => 
       {     
        console.log("JSON ISSS: " + JSON.stringify(json))
        if (!(Object.keys(json).length==0 || json.hasOwnProperty('error'))){
        localStorage.setItem('usertoken',json)
        this.props.history.push(`/profile`)
        }
        else
        {
          alert("Invalid username/password");
        }
    })
    .catch(err => {
      console.log(err)
    } 
    )
   // this.props.history.push(`/profile`)
  }

  render() {
    return (
     
      <div className="container">
         <Navbar />
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login