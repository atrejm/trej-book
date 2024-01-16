import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect } from "react";

export default function Homepage() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userContext.loggedIn) {
            navigate("login");
        }
    }, [userContext.loggedIn, navigate])

    return(
        <h1>Loggin in and viewing homepage</h1>
    )
}