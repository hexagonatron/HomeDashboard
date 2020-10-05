import React, { useEffect } from 'react';
import * as halfmoon from 'halfmoon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-regular-svg-icons'

export const Nav = () => {

    useEffect(() => {
        halfmoon.onDOMContentLoaded();
    }, []);

    return (
        <nav className="navbar justify-content-between">
            <span></span>
            <span className="navbar-brand text-center">
                Adelaide Movie Times
            </span>
            <div className="navbar-content">
                <button className="btn" onClick={() => halfmoon.toggleDarkMode()}>
                    <FontAwesomeIcon icon={faMoon}/>
                </button>
            </div>
        </nav>
    )
}

export default Nav;