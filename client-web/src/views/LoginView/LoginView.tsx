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
        Cookies.set('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0YTAzNmNmLTdlZDUtNDFmOC1iNTdhLTRmODgwYzRkYTVmYiIsImlhdCI6MTU5NTM4MDI4NywiZXhwIjoxNTk3OTcyMjg3fQ.rnNbfykvEytJBjvL_cfrYR0zNw_Q3aqERr2DJaLkfa8')
        history.push('/home')
    }
    return (
        <div>
            login
            <button onClick={login}>login</button>
        </div>
    )
}
