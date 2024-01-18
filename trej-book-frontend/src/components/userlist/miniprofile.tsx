import { useEffect, useState } from "react";
import { ProfileID } from "../../routes/profile";
import { IProfile } from "../profile/profilebody";
import { getProfile } from "../../helpers/request";
import { Card, Col, Image, Row } from "react-bootstrap";

export default function MiniProfile({profileId}: {profileId: ProfileID | undefined}) {
    const [profile, setProfile] = useState<IProfile>()

    useEffect(()=>{
        
        async function fetchProfile() {
            console.log("searching for profile");
            const url = sessionStorage.getItem('API_URL') + `profile/${profileId}`
            const response = await getProfile(url)
            setProfile(response);
            console.log(response);
        }

        fetchProfile()
    }, [profileId])

    return (
        <>
        <Card style={{width: '60%'}}>
            <Row>
                <Col xs={2}>
                    <Image src={profile?.profilePicURL} alt="no-pfp" rounded />
                </Col>
                <Col xs={6}>
                    <h3>{profile?.user.firstname}</h3>
                    <p>{profile?.bio}</p>
                </Col>
            </Row>
        </Card>

        </>
    )
}