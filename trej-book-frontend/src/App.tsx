import { useEffect, createContext, useState, Dispatch, SetStateAction } from 'react'
import { API_URL } from './config'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, useNavigate } from 'react-router-dom';
import NavHeader from './components/navbar';
import { IProfile } from './components/profile/profilebody';

export type UserID = string;

export interface ExpressValidationErrorResponse {
  location: string;
  msg: string;
  path: string;
  type: string;
  value: string;
}

// export interface IUser {
//   loggedIn: boolean,
//   userId: UserID | null,
//   profile?: ProfileID | IProfile,
//   jwToken: JsonWebKey | null,
//   firstname?: string,
//   lastname?: string,
//   username?: string,
//   friends?: Array<UserID>,
// }

export interface IUser{
  _id: UserID | null;
  loggedIn: boolean;
  jwToken: JsonWebKey | null;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  profile?: IProfile;
  chats?: Array<string>;
  thumbnailURL?: string
}

export type UserContextType = {
  currentUser: IUser;
  setCurrentUser: Dispatch<SetStateAction<IUser>>;
}

export const UserContext = createContext<UserContextType>({
  currentUser: {_id: null,
  loggedIn: false,
  jwToken: null,
},
  setCurrentUser: () => {}
})

function App() {
  const [currentUser, setCurrentUser] = useState<IUser>({
    _id: null,
    loggedIn: false,
    jwToken: null,
  });
  
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

  }, [])
  

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
