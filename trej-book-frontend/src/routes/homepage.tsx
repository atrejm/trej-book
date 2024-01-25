import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/sidebar/sidebar";

export default function Homepage() {
    const {currentUser,} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!currentUser.loggedIn) {
            navigate("../login");
        }
        if(!currentUser) {
            navigate("..");
        }
    }, [])

    return(
        <>
                {currentUser.loggedIn
                ?
                <Row style={{height: "100vh"}}>
                    <Col xs={4} className="bg-secondary p-0" style={{maxWidth:"256px"}}>
                        <Sidebar />
                    </Col>
                    <Col>
                        <Outlet />
                    </Col>
                </Row>
                :
                <></>
                }
        </>
    )
}