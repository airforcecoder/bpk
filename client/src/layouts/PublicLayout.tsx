/* Import the react and navbar components */
import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
/*BPK 68*/
import AnnouncementNotice from '../features/announcement/AnnouncementNotice'
/*BPK 68*/

/* Create the wrapper function so all routes use navbar and footer (when complete)*/
function PublicLayout(){
    return(
        <>
        <Navbar />
        {/*BPK 68*/}
        <AnnouncementNotice />
        {/*BPK 68*/}
        <Outlet />
        <Footer />
        </>
        
    )
}

export default PublicLayout


