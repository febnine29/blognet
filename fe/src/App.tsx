import React, { useEffect, useState } from 'react';
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
import Profile from './layout/Profile';
import Test from './component/Test';
import './App.css';
import Chat from './layout/Chat';
import ChatBoxDetail from './component/ChatBoxDetail';

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
            path="/profileId/:userIdParams" 
            element={
              <Profile />
            }
          />
          <Route 
            path="/chat"
            element={
              <Chat />
            }
          />
          <Route 
            path="/chatId/:fromid/:toid"
            element={
              <ChatBoxDetail />
            }
          />
          {/* {userList && userList.map(userId => ( */}
            
            <Route 
              path="/test" 
              element={<Test />}
            />
          {/* ))} */}
        </Routes>
      </div>
  );
}

export default App;
