import { useRoutes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import routes from './Routes';
import theme from './resources/index'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {


  let element = useRoutes(routes);

  return (
    <>
      <ChakraProvider theme={theme} >
        <Toaster
          position='bottom-top-center'
          reverseOrder={false}
        />
        {element}
      </ChakraProvider>
    </>
  )
}

export default App
