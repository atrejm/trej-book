import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/sidebar/sidebar";
import NavHeader from "../components/navbar";

export default function Homepage() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userContext.loggedIn) {
            navigate("../login");
        }
    }, [userContext.loggedIn, navigate])

    return(
        <>
            <NavHeader />
            {userContext.loggedIn
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