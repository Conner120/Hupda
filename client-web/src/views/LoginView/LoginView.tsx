import React from 'react'
import Cookies from 'js-cookie'
import { useHistory } from "react-router-dom";
export default function Home() {
    let history = useHistory();
    if (Cookies.get('jwt')) {
        history.push('/home')
    } else {
    }
    const login = () => {
        Cookies.set('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyYjlhNjhlLTI1YmQtNDYxNC04NjUyLTJhYzg5YTg4OTVmNyIsImlhdCI6MTU5NjI0MDkyMiwiZXhwIjoxNTk4ODMyOTIyfQ.YWrIgPozf38gKyUlVdIdDYrAxrovkaTlkM8qm8ehfEU')
        history.push('/home')
    }
    return (
        <div>
            login
            <button onClick={login}>login</button>
        </div>
    )
}
