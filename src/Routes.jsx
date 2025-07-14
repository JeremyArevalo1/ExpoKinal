import LandingPage from "./pages/LandingPage";
import ProtectYourselfPage from "./pages/protectYourself";

const routes = [
    {path: '/*',element: <LandingPage/>},
    {path: '/PageProtegete',element: <ProtectYourselfPage/>}
]

export default routes