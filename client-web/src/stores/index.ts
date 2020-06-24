import React from 'react'
import AppState from './AppState'
const storesContext = React.createContext({
	AppState: new AppState(),
})

export const useStores = () => React.useContext(storesContext)