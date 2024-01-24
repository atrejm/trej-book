import { useEffect, useState } from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function MiniProfile({user}: {user: any | undefined}) {
    const [profilePic, setProfilePic] = useState<string>()

    useEffect(() => {
        if(!user?.profile?.profilePicURL)
            setProfilePic("../../public/chuck.jpg")
        else
            setProfilePic(user.profile.profilePicURL)
    },[])
    

    // useEffect(()=>{
        
    //     async function fetchProfile() {
    //         console.log("searching for profile");
    //         const url = sessionStorage.getItem('API_URL') + `profile/${profile}`
    //         const response = await getProfile(url)
    //         if(!response.profilePicURL)
    //             response.profilePicURL = "../../public/chuck.jpg";
    //         setProfile(response);
    //         console.log(response);

            
    //     }

    //     fetchProfile()
    // }, [profileId])

    return (
        <>
        <Card style={{width: '60%'}}>
            <Row>
                <Col xs={2}>
                    <Image src={profilePic} alt="no-pfp" rounded />
                </Col>
                <Col xs={6}>
                    <h3>{user.firstname}</h3>
                    <p>Bio: {user.profile.bio}</p>
                    <Link to={'../profile'} state={{ profileID: user.profile?._id}}><small>View Profile</small></Link>
                </Col>
            </Row>
        </Card>

        </>
    )
}