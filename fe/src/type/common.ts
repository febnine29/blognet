import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import dayjs from "dayjs";

const date = dayjs()
export const dateNow = date.format('YYYY-MM-DD HH:mm:ss')
export interface Ilogin{
    username: string;
    password: string;
}
export const Color = "#4200eb"
export interface IComment{
    id: number;
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string,
    isLiked: string
}
export interface IChildrenCmt{
    id: number;
    cmtId: number;
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string
}
export interface SingleChildrenCmt{
    cmtId: number;
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string
}
export interface SingleComment{
    descrip: string;
    userId: number;
    postId: number;
    createdAt: string,
    isLiked: string
}
export interface ILike{
    id: number;
    userId: number;
    postId: number
}
export interface IPost{
    id: number;
    descrip: string;
    userId: number;
    img: string[];
    createdAt: string;
    isLiked: string
}
export interface ISinglePost{
    descrip: string;
    userId: number;
    img: string[];
    createdAt: string;
    isLiked: string
}
export interface ResponseGetPosts{
    error: null;
    success: boolean;
    targetUrl: null;
    unAuthorizedRequest: boolean;
    result: IPost[] | null;
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
export const like = async (body: {userId: number, postId: number}) => {
    try{
        await axios.post(`http://localhost:5000/api/v1/likes/like`,{body})
        .then(response => {
            return response
        })
        .catch(error => {
            return error
        })
    } catch (error) {
        return error
    }
}
export const unLike = async (body: {userId: number, postId: number}) => {
    try{
        await axios.post(`http://localhost:5000/api/v1/likes/unLike`,{body})
        .then(response => {
            return response
        })
        .catch(error => {
            return error
        })
    } catch (error) {
        return error
    }
}
export const updateLiked = async (liked: boolean, postId: number) => {
    try {
        await axios.put(`http://localhost:5000/api/v1/posts/isLiked=${postId}`,{liked})
    } catch (error) {
        return error
    }
}