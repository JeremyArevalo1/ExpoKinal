import React from 'react';
import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaLink } from 'react-icons/fa';
import { useSurveillance } from '../context/SurveillanContext';

const SharePanel = ({ url = window.location.pathname }) => {
  const toast = useToast();
  
  const { generatedImageBase64 } = useSurveillance();
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'ENLACE COPIADO',
        description: 'Has duplicado un rastro digital.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    }).catch((error) => {
      console.error("Error al copiar al portapapeles", error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al copiar el enlace.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    });
  };

  const downloadImage = (base64Data) => {
  const imageUrl = base64Data; // Aquí se arma la URL completa
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'imagen_instagram.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleInstagramShare = (e) => {
  const image = generatedImageBase64; 
    console.log("imagen a compartir",generatedImageBase64);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
downloadImage(image);
  if (!isMobile && image) {
    downloadImage(image);  // Pasamos solo la base64 pura

   

    toast({
      title: 'Imagen descargada',
      description: 'No olvides compartirnos en tus redes.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  } else {
    e.preventDefault();
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'ENLACE COPIADO',
        description: 'Acepta Nuestras Politicas para descargar una imagen para tus redes',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    }).catch((error) => {
      console.error("Error al copiar al portapapeles", error);
      toast({
        title: 'Error',
        description: 'Hubo un problema al copiar el enlace.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      });
    });
  }
};




  return (
    <Box
      bg="blackAlpha.700"
      border="1px solid #ff0044"
      p={4}
      borderRadius="md"
      boxShadow="0 0 15px #ff0044"
      maxW="fit-content"
      mx="auto"
      mt={6}
      backdropFilter="blur(3px)"
    >
      <HStack spacing={4}>
        <Tooltip label="Compartir en Facebook">
          <IconButton
            as="a"
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + url)}`}
            target="_blank"
            icon={<FaFacebook />}
            aria-label="Compartir en Facebook"
            bg="transparent"
            color="white"
            _hover={{
              bg: 'black',
              boxShadow: '0 0 10px #1877f2',
              color: '#1877f2',
            }}
          />
        </Tooltip>

        <Tooltip label="Compartir en Instagram">
          <IconButton
            onClick={handleInstagramShare}
            icon={<FaInstagram />}
            aria-label="Compartir en Instagram"
            bg="transparent"
            color="white"
            _hover={{
              bg: 'black',
              boxShadow: '0 0 10px #e1306c',
              color: '#e1306c',
            }}
          />
        </Tooltip>

        <Tooltip label="Compartir por WhatsApp">
          <IconButton
            as="a"
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.origin + url)}`}
            target="_blank"
            icon={<FaWhatsapp />}
            aria-label="Compartir en WhatsApp"
            bg="transparent"
            color="white"
            _hover={{
              bg: 'black',
              boxShadow: '0 0 10px #25d366',
              color: '#25d366',
            }}
          />
        </Tooltip>

        <Tooltip label="Copiar enlace al portapapeles">
          <IconButton
            onClick={handleCopyLink}
            icon={<FaLink />}
            aria-label="Copiar enlace"
            bg="transparent"
            color="white"
            _hover={{
              bg: 'black',
              boxShadow: '0 0 10px white',
              color: '#ffffff',
            }}
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default SharePanel;
