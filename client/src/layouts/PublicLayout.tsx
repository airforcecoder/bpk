/* Import the react and navbar components */
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'

/* Create the wrapper function so all routes use navbar and footer (when complete)*/
function PublicLayout(){
    return(
        <>
        <Navbar />
        <Outlet />
        </>
    )
}

export default PublicLayout

