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
  setFriends?: any,
}

export const UserContext = createContext<IUser>({
  loggedIn: false,
  userId: null,
  jwToken: null,
  friends: [],
  setFriends: (friends: Array<IUser>) => {}
})

function App() {
  const userContext = useContext(UserContext);
  
  const navigate = useNavigate();

  const userStr = sessionStorage.getItem("user");
    
  let user;
  if(userStr){ 
    console.log(JSON.parse(userStr))
    user = JSON.parse(userStr);
    userContext.loggedIn = user.loggedIn;
    userContext.loggedIn = user.loggedIn,
    userContext.userId = user.userId,
    userContext.profile = user.profile,
    userContext.jwToken = user.jwToken,
    userContext.firstname = user.firstname,
    userContext.lastname = user.lastname,
    userContext.username = user.username,
    userContext.friends = user.friends
  }

  const [userState, setUserState] = useState(user);

  useEffect(() => {
    sessionStorage.setItem("API_URL", API_URL);

    async function getSomething() {
      const res = await fetch(API_URL);
      const data = await res.json();

      console.log(data);
    }

    if(!userContext.loggedIn) {
      navigate('login');
    } else {
      navigate('../home')
    }

    getSomething();
  }, [navigate, userContext.loggedIn])
  

  return (
    <>
      <NavHeader />
      <UserContext.Provider value={userState}>
        <Outlet />
      </UserContext.Provider>
    </>
  )
}

export default App
