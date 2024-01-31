import { useContext, useEffect, useState } from "react"
import { IUser, UserContext } from "../App"
import { getUsers } from "../helpers/request"
import MiniProfile from "../components/userlist/miniprofile"

export default function UsersList() {
    const [allUsers, setAllUsers] = useState<Array<IUser>>()
    const {currentUser} = useContext(UserContext)

    useEffect(() => {
        console.log("getting users");
        async function requestUsers() {
            const url = sessionStorage.getItem("API_URL") + "users";
            const response = await getUsers(url);
            const filteredUsers = response.users?.filter((user) => {
                if(!user._id)
                    return false
                return !((user._id === currentUser._id) || (currentUser.profile?.friends?.includes(user._id)))
            })
            setAllUsers(filteredUsers);
        }

        requestUsers();
    }, [])

    return (

        <div>
            <h1>List of Users</h1>
            {allUsers?.map((user) => (
                <div>
                    <MiniProfile key={user._id} user={user}/>
                </div>
                ))}
        </div>
    )
}