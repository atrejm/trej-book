import { useEffect, createContext, useContext } from 'react'
import { API_URL } from './config'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, useNavigate } from 'react-router-dom';
import NavHeader from './components/navbar';

interface IUser {
  loggedIn: boolean,
  userId: number | null,
  jwToken: JsonWebKey | null,
}

export const UserContext = createContext<IUser>({
  loggedIn: false,
  userId: null,
  jwToken: null
})

function App() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  

  useEffect(() => {
    sessionStorage.setItem("API_URL", API_URL);

    async function getSomething() {
      const res = await fetch(API_URL);
      const data = await res.json();

      console.log(data);
    }

    if(!userContext.loggedIn) {
      navigate('login');
    }

    getSomething();
  }, [])
  

  return (
    <>
      <NavHeader />
      <UserContext.Provider value={userContext}>
        <Outlet />
      </UserContext.Provider>
    </>
  )
}

export default App
