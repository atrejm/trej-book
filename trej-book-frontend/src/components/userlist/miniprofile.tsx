import { useEffect, useState } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUser } from "../../App";

export default function MiniProfile({user}: {user: IUser}) {
    const [profilePic, setProfilePic] = useState<string>()

    useEffect(() => {
        if(!user?.profile?.profilePicURL)
            setProfilePic("../../public/chuck.jpg")
        else
            setProfilePic(user.profile.profilePicURL)
    },[])


    return (
        <>
        <Card style={{width: '60%'}}>
            <Row>
                <Col xs={2}>
                    <Image src={profilePic} alt="no-pfp" rounded />
                </Col>
                <Col xs={6}>
                    <h3>{user.firstname}</h3>
                    <p>Bio: {user.profile?.bio}</p>
                    <Link to={'../profile'} state={{ profileID: user.profile?._id}}><small>View Profile</small></Link>
                </Col>
            </Row>
        </Card>

        </>
    )
}