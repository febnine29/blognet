import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams
} from "react-router-dom";
import Login from './layout/Login';
import Register from './layout/Register';
import Home from './layout/Home';
import Navbar from './component/Navbar';
import Post from './component/Post';
import './App.css';

function App() {
  return (
      <div className="App" style={{fontFamily: 'Roboto, sans-serif'}}>
        <Routes>
          <Route 
            path="/"
            element={
              <Home />
            }
          />
          <Route 
            path="/login" 
            element={
              <Login />
            }
          />
          <Route 
            path="/register" 
            element={
              <Register />
            }
          />
          <Route 
            path="/post" 
            element={
              <Post />
            }
          />
        </Routes>
      </div>
  );
}

export default App;
