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
import { getUserInfo } from './type/UserSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/store';
import ShowSinglePost from './layout/ShowSinglePost';

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const userInfo = JSON.parse(localStorage.getItem('userInformation') || '{}');
  useEffect(() => {
    if(userInfo){
      dispatch(getUserInfo(userInfo[0]?.id!))
    }
  },[userInfo])
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
            path="/chat/:toIdParams"
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
          <Route 
            path="/singlepostid/:postid"
            element={
              <ShowSinglePost />
            }
          />  
          <Route 
            path="/test" 
            element={<Test />}
          />
        </Routes>
      </div>
  );
}

export default App;
