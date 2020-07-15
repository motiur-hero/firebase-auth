import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.Config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn: false,
    name: '',
    email:'',
    photo:''
  })

  var provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName,email,photoURL} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser)
      console.log(displayName,email,photoURL)
    })
    .catch(err => {
      console.log(err);
      console.log(err.message)
    })
    
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn:false,
        name:'',
        mail:'',
        photo:'',
        password:'',
        error: '',
        existingUser: false,
        isValid: false
      }
      setUser(signedOutUser)
  })
  .catch(err =>{
    console.log(err)
    })
  }
  
  const is_valid_email = email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const isNumber = input => /\d/.test(input);
 
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    // perform validation
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    };
    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && isNumber(e.target.value);

    }
    
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);

  }

    const createAccount = (event) => {
      if(user.isValid){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      
      .then(res =>{
      console.log(res);
      const createUser ={...user}
      createUser.isSignedIn = true;
      createUser.error = '';
      setUser(createUser);
    })
    .catch(err=> {
      console.log(err.message);
      const createUser ={...user}
      createUser.isSignedIn = false;
      createUser.error = err.message
      setUser(createUser);
    })
  }
    
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    
    .then(res =>{
    console.log(res);
    const createUser ={...user}
    createUser.isSignedIn = true;
    createUser.error = '';
    setUser(createUser);
  })
  .catch(err=> {
    console.log(err.message);
    const createUser ={...user}
    createUser.isSignedIn = false;
    createUser.error = err.message
    setUser(createUser);
  })
}
    event.preventDefault();
    event.target.reset();
  }
  const switchForm = e=>{
    const createUser ={...user}
    createUser.existingUser = e.target.checked
    setUser(createUser);
    
  }

  return ( 
    <div className="App">
    {user.isSignedIn ?<button onClick={handleSignOut}>Sign Out</button> :
    <button onClick={handleSignIn}>Sign In</button>}
    {
      user.isSignedIn && <div>
        <p>Welcome, {user.name}</p>
        <p>Your mail: {user.email}</p>
        <img src={user.photo} alt=''></img>

      </div>
    }
    <h1>Our own authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">signInUser</label>
      
      <form style={{display: user.existingUser ? 'block':'none'}} onSubmit={signInUser}>
      <input  type="text" placeholder="Your Email" name="email" required/>
      <br/>
      <input  type="password" name="password" placeholder="Your Password" required/>
      <br/>
      <input type='submit' value="signIn"/>
      </form>
      
      <form style={{display: user.existingUser ? 'none':'block'}} onSubmit={createAccount}>
      <input onBlur={handleChange} type="text" placeholder="Your Name" name="name" required/>
      <br/>
      <input onBlur={handleChange} type="text" placeholder="Your Email" name="email" required/>
      <br/>
      <input onBlur={handleChange} type="password" name="password" placeholder="Your Password" required/>
      <br/>
      <input type='submit' value="Create Account"/>
      </form>
      {
        user.error && <p style={{color:'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
