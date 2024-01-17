import ProfileBody from "../components/profile/profilebody";
import { useLocation } from "react-router-dom";

export type ProfileID = string;

export default function Profile() {
    const location = useLocation();
    const { profileID } = location.state;

    return(
        <ProfileBody profileID={profileID} />
    )
}