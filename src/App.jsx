import './App.css'
import { Routes,Route,Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Links from './pages/Links/Links';
// import Settings from './pages/Settings/Settings';
import Analytics from './pages/Analytics/Analytics'

function App() {
 const [isAuthenticated , setIsAuthenticated] = useState(false);


  const PrivateRoute = ({element})=>{
    return isAuthenticated ? element : <Navigate to="/login" />
  }


  return (
    <div className='app'>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={< Navigate to ='/signup'/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Layout />} />} >
        <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='links' element={<Links />} />
          {/* <Route path='settings' element={<Settings />} /> */}
          <Route path='analytics' element={<Analytics />} />
        </Route>
        </Routes>
    </div>
  )
}


export default App;
