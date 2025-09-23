import { BrowserRouter, Route, Routes} from 'react-router';
import { LayoutMain } from './layouts/layout-main';
import { HomePage } from './pages/home-page';
import { NotFoundPage } from './pages/not-found-page';
import { RedirectPage } from './pages/redirect-page';


export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutMain/>}>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/:shortUrl' element={<RedirectPage/>}/>
          <Route path='/notFound/:shortUrl' element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

