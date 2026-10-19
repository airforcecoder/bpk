/* Import the react and navbar components */
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* Create the wrapper function so all routes use navbar and footer (when complete)*/
function PublicLayout(){
    return(
        <>
        <Navbar />
        <Outlet />
        <Footer />
        </>
        
    )
}

export default PublicLayout

