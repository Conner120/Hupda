import React from 'react'
import { useParams } from "react-router-dom";
export default function TopicViewPostView() {
    const { key } = useParams();
    return (
        <div>
            {key}
        </div>
    )
}
