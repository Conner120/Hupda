import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { useStores } from '../../stores'
import { Post } from '../../components'
export default function TopicViewPostView() {
    const { key } = useParams();
    return (
        <div>
            {key}
        </div>
    )
}
