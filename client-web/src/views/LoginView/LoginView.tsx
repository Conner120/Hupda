import React from 'react'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
export default function Home() {
    let history = useHistory();
    if (Cookies.get('jwt')) {
        // AppState.auth = Cookies.get('jwt')
        history.push('/home')
    } else {
    }
    const login = () => {
        Cookies.set('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyYjlhNjhlLTI1YmQtNDYxNC04NjUyLTJhYzg5YTg4OTVmNyIsInVzZXJuYW1lIjoidGMxIiwicGFzc3dvcmQiOiIkMmEkMTAkVmllMXNNWVRTT1NZcHlRWEJuckpZLklTTjh5UW90L2tUZlN0azRvOGVicVM4aFRXYnVVU0ciLCJjcmVhdGVkQXQiOiIyMDIwLTA2LTE3VDAyOjM2OjQ5LjUwNFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTA2LTE3VDAyOjM2OjQ5LjUwNFoiLCJpYXQiOjE1OTI1ODE2NzQsImV4cCI6MTU5NTE3MzY3NH0.EZFQZSnOtL-PpLBIefuXoB0XX27JbCRIl_aTrIvDH8c')
        history.push('/home')
    }
    return (
        <div>
            login
            <button onClick={login}>login</button>
        </div>
    )
}
