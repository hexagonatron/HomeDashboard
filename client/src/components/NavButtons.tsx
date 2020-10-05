import React from 'react';
import './NavButtons.scss';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';

export const NavButtons = (props: RouteComponentProps) => {
    return (
        <div className="container mt-20 d-flex justify-content-center">
            <div className="btn-group nav-btn-container" role="group">
                <Link to="/date"
                    className={classnames(
                        "btn nav-btn",
                        {"btn-primary": props.location.pathname === "/date" || props.location.pathname === "/"}
                    )}
                >
                    By Date
                </Link>
                <Link to="/movie" 
                className={
                    classnames(
                        "btn nav-btn",
                        {"btn-primary": props.location.pathname === "/movie"}
                    )}
                >
                    By Movie
                    </Link>
                <Link to="/cinema" className={
                    classnames(
                        "btn nav-btn",
                        {"btn-primary": props.location.pathname === "/cinema"}
                    )}
                >
                    By Cinema
                </Link>
            </div>
        </div>
    )
}

export default withRouter(NavButtons);