/* Example page that shows the .tsx structure for the team:
   pages are functions --> return () --> main --> sections --> buttons, headers, components
*/

/* Function initialization */
function UITestPage() {

  /* React returns the JSX that should be displayed */
  return (

    /* Start main, WE USE THE CONTAINER I MADE SO THE WEBSITE USES THE SAME RESOLUTION/SIZE FOR ALL PAGES SEE THE EXAMPLE HERE 
    This is important for different sized devices to use page-container*/
    <main className="page-container">

      {/* Section */}
      <section>

        {/* Header example (default white)*/}
        <h1>UI TEST DEFAULT COLOR</h1>
        
        {/* Header example (change color) */}
        <h1 style ={{color:'black'}}> UI TEST COLOR CHANGE</h1>

      </section>

      {/* End main */}
    </main>

  )
}

/* Makes this component available to other files */
export default UITestPage

/* WE then route the page in <route> in App.tsx */