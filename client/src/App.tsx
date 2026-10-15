import { BrowserRouter, Routes, Route } from 'react-router'
import UITestPage from './pages/ui-test-page'

function App() {
  return (
    <BrowserRouter>

    {/*This is where we route pages*/}
      <Routes>
        {/*We put it pages this format: path ="<what you want the URL to be in address bar>"" and element = {<function>}*/}
        <Route path="/ui-test" element={<UITestPage />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App