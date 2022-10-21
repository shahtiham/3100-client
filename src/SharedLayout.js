import { Link, Outlet } from "react-router-dom";
import Header from "./Header";
import {AppProvider} from './Context'

function SharedLayout() {
    return (
        <>
            <Header />
            <Outlet />
            <footer className="App-footer">
                coding-queries &copy; 2022
            </footer>
        </>
    );
}

export default SharedLayout;