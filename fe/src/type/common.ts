import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
export interface Ilogin{
    username: string;
    password: string;
}
export interface IComment{
    id: number;
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string
}
export const url = 'http://localhost:5000/api/v1'
export const loginApi = `${url}/auth/login`
export const registerApi = `${url}/auth/register`
export const getAllPostsApi = `${url}/posts/getAllPosts`
export const getPostById = `${url}/posts/getPostId=`
export const createPostApi = `${url}/posts/createPost`
export const updatePostId = `${url}/posts/updatePostId=`
export const deletePostId = `${url}/posts/deletePostId=`

export const getLike = async (body: {pId: number}) => {
    try{
        axios.get(`http://localhost:5000/api/v1/likes/getLikes=${body.pId}`)
        .then(response => {
            console.log(response.data.data)
            return response
        })
        .catch(error => {
            return error
        })
    } catch (error) {
        return error
    }
}

export const getComments = async (body: {id: number}) => {
    try{
        axios.get(`http://localhost:5000/api/v1/likes/getLikes=${body.id}`)
        .then(response => {
            console.log(response.data.data)
            return response
        })
        .catch(error => {
            return error
        })
    } catch (error) {
        return error
    }
}