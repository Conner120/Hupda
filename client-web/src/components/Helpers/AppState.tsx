import React from 'react'

import { useStores } from '../../stores'

import { useHistory } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
const GET_PROFILE = gql`
query getProfile{
    Account{
      id
    }
  }
`;

export default function AppState() {
  const { App, Profile } = useStores();
  const onCompleted = (data: any) => {
    console.log(data)
    Profile.id = data.Account.id
  }
  useQuery(GET_PROFILE, { onCompleted, })

  return (
    <div />
  )
}
