import { useEffect, createContext, useContext, useState } from 'react'
import { API_URL } from './config'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, useNavigate } from 'react-router-dom';
import NavHeader from './components/navbar';
import { ProfileID } from './routes/profile';
import { IProfile } from './components/profile/profilebody';

export type UserID = string;

export interface ExpressValidationErrorResponse {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
}

export interface IUser {
  loggedIn: boolean,
  userId: UserID | null,
  profile?: ProfileID | IProfile,
  jwToken: JsonWebKey | null,
  firstname?: string,
  lastname?: string,
  username?: string,
  friends?: Array<UserID>,
}

export const UserContext = createContext(null)

function App() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  
  const navigate = useNavigate();

 
  
  

  useEffect(() => {
    sessionStorage.setItem("API_URL", API_URL);
    const userStr = sessionStorage.getItem("user");

    if(!currentUser && userStr){ 
      console.log("Data from storage: ", JSON.parse(userStr))
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      navigate("feed")
    }

    if(!currentUser) {
      navigate('login');
    } else {
      navigate('../home')
    }

  }, [currentUser])
  

  return (
    <>
      <UserContext.Provider value={{currentUser, setCurrentUser}}>
        <NavHeader />
        <Outlet />
      </UserContext.Provider>
    </>
  )
}

export default App
