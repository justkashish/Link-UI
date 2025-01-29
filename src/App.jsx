import './App.css'
import { Routes,Route,Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Links from './pages/Links/Links';
import Settings from './pages/Settings/Settings';
import Analytics from './pages/Analytics/Analytics';
import LinkPage from './pages/LinkPage';


function App() {
 const [isAuthenticated , setIsAuthenticated] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");


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
         {/* Define the route for shortened link */}
         <Route path="/:id" element={<LinkPage />} />
        <Route path='/home' element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Layout />} />} >
        <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='links' element={<Links />} />
          <Route path='settings' element={<Settings />} />
          <Route path='analytics' element={<Analytics searchQuery={searchQuery} />} />
        </Route>
        </Routes>
    </div>
  )
}


export default App;