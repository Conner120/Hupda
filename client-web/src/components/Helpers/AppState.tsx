import React, { useState, useEffect } from 'react'
import { Post } from '../../Htypes';

import { useStores } from '../../stores'

import { useHistory } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import { profile } from 'console';
const GET_PROFILE = gql`
query getProfile{
    Account{
      id
    }
  }
`;

export default function AppState() {
  const history = useHistory();
  const { App, Profile } = useStores();
  const onCompleted = (data: any) => {
    console.log(data)
    Profile.id = data.Account.id
  }
  const { loading, error } = useQuery(GET_PROFILE, { onCompleted, })

  return (
    <div />
  )
}
