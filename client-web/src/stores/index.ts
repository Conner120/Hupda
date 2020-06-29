import React from 'react'
import AppState from './AppState'
import ProfileState from './ProfileState'
const storesContext = React.createContext({
	App: new AppState(),
	Profile: new ProfileState()
})

export const useStores = () => React.useContext(storesContext)