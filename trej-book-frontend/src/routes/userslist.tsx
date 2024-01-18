import { useEffect, useState } from "react"
import { IUser } from "../App"
import { getUsers } from "../helpers/request"
import MiniProfile from "../components/userlist/miniprofile"

export default function UsersList() {
    const [allUsers, setAllUsers] = useState<Array<IUser>>()

    useEffect(() => {
        console.log("getting users");
        async function requestUsers() {
            const url = sessionStorage.getItem("API_URL") + "users";
            const response = await getUsers(url);
            setAllUsers(response.users);
        }

        requestUsers();
    }, [])

    return (

        <div>
            <h1>List of Users</h1>
            {allUsers?.map((user) => (
                <div>
                    <MiniProfile profileId={user.profile}/>
                </div>
                ))}
        </div>
    )
}