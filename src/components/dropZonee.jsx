import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageToBase64, useGoogleVision, useOpenRouterChat, useSurveillanceImage, useUploadSurveillanceImages } from '../shared/hooks';
import { useSurveillance } from '../context/SurveillanContext';
import PDFGenerator from './PDFGenerator';
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  useColorModeValue,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Checkbox,
  useBreakpointValue,
  Tooltip
} from '@chakra-ui/react';

const GOOGLE_API_KEY = 'AIzaSyDFkalZAnAf0xvJo_f4D2kzhU9JYWpDFAU';

// CSS para animaciones personalizadas
const animationStyles = `
  @keyframes scanLine {
    0% { top: -2px; }
    100% { top: 100%; }
  }
  
  @keyframes glitchEffect {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-2px); filter: hue-rotate(90deg); }
    20% { transform: translateX(2px); filter: hue-rotate(180deg); }
    30% { transform: translateX(-1px); filter: hue-rotate(270deg); }
    40% { transform: translateX(1px); filter: hue-rotate(0deg); }
  }
  
  @keyframes pulseAnimation {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  
  @keyframes flickerAnimation {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = animationStyles;
  document.head.appendChild(styleSheet);
}

// Componente para el texto de consentimiento
const ConsentText = ({ fontSize }) => (
  <Text
    fontSize={fontSize}
    color="red.200"
    lineHeight="1.4"
    opacity={0.9}
  >
    Acepto que mis datos biométricos, imágenes faciales y patrones de comportamiento sean
    analizados por sistemas de inteligencia artificial para perfilado psicológico y evaluación
    de riesgo. Entiendo que esta información será procesada, almacenada y compartida con
    autoridades pertinentes según sea necesario para propósitos de vigilancia y seguridad.
  </Text>
);

const DropzoneImageUploader = () => {
  const { base64, convert, loading: converting, error: convertError } = useImageToBase64();
  const { analyzeImage, result, loading: analyzing, error: analyzeError } = useGoogleVision(GOOGLE_API_KEY);
  const { sendMessage, response: chatResponse, loading: chatLoading, error: chatError } = useOpenRouterChat();

  const [processed, setProcessed] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);
  const [scanningActive, setScanningActive] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [esValido, setEsValido] = useState(false);
  const [touch, setTouch] = useState(false);
  const [id, setId] = useState(() => `${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  const [date, setDate] = useState(() => new Date().toLocaleString());

  const { setOriginalImageBase64 } = useSurveillance();
  const { uploadBoth } = useUploadSurveillanceImages();
  const { authorization, setAuthorization } = useSurveillance();
  const { emails, setEmails } = useSurveillance();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const dropzoneMinHeight = useBreakpointValue({ base: '300px', md: '400px' });
  const mainFontSize = useBreakpointValue({ base: 'lg', md: 'xl' });
  const iconSize = useBreakpointValue({ base: '2xl', md: '4xl' });
  const progressWidth = useBreakpointValue({ base: '250px', md: '300px' });
  const gridSpacing = useBreakpointValue({ base: 4, md: 8 });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const headerDirection = useBreakpointValue({ base: 'column', md: 'row' });
  const headerSpacing = useBreakpointValue({ base: 2, md: 0 });

  const textColor = useColorModeValue('gray.600', 'gray.400');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || !file.type.startsWith('image/')) {
      console.warn('⚠️ El archivo no es una imagen');
      return;
    }
    setProcessed(false);
    setCurrentImageFile(file);
    setScanningActive(true);
    convert(file);
  }, [convert]);

  useEffect(() => {
    if (base64 && !processed) {
      analyzeImage(base64);
    }
  }, [base64, analyzeImage, processed]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email || !email.includes('@')) {
      toast.error('Por favor, introduce un correo válido.', {
        style: {
          background: 'linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)',
          color: '#742A2A',
          border: '1px solid rgba(229, 62, 62, 0.3)',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          boxShadow: '0 8px 32px rgba(229, 62, 62, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          borderLeft: '4px solid #E53E3E',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '400px',
          minWidth: '300px'
        },
        iconTheme: {
          primary: '#E53E3E',
          secondary: '#FFFFFF',
        },
        duration: 4000,
        position: 'bottom-right',
      });
      return;
    }

    try {
      const result = await emailjs.send(
        'service_fl7az7h',
        'template_ir6wrpg',
        {
          to_email: email,
          session_id: id,
          timestamp: date,
          respuesta: chatResponse
        },
        'YbRlerj0gNgVm-A28'
      );

      toast.success('El email se envió correctamente', {
        style: {
          background: 'linear-gradient(135deg, #F0FFF4 0%, #C6F6D5 100%)',
          color: '#22543D',
          border: '1px solid rgba(56, 161, 105, 0.3)',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          boxShadow: '0 8px 32px rgba(56, 161, 105, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          borderLeft: '4px solid #38A169',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '400px',
          minWidth: '300px'
        },
        iconTheme: {
          primary: '#38A169',
          secondary: '#FFFFFF',
        },
        duration: 4000,
        position: 'top-right',
      });

      setEmail('');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      toast.error('Hubo un error al enviar el correo.', {
        style: {
          background: 'linear-gradient(135deg, #FFF5F5 0%, #FED7D7 100%)',
          color: '#742A2A',
          border: '1px solid rgba(229, 62, 62, 0.3)',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
          boxShadow: '0 8px 32px rgba(229, 62, 62, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          borderLeft: '4px solid #E53E3E',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '400px',
          minWidth: '300px'
        },
        iconTheme: {
          primary: '#E53E3E',
          secondary: '#FFFFFF',
        },
        duration: 4000,
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    if (result && !processed) {
      const labels = result.labelAnnotations?.map(label => label.description).join(', ') || '';
      const prompt = `
        Actúa como un analista de vigilancia forense especializado en perfilado de individuos mediante análisis visual avanzado. Tu misión es crear un perfil completo y detallado basado en las siguientes etiquetas extraídas por nuestro sistema de reconocimiento.
        ANÁLISIS REQUERIDO:
        1.EVALUACIÓN VISUAL COMPLETA: Describe con precisión quirúrgica lo observado. Identifica objetos, personas, entorno. Clasifica la escena (residencial, comercial, industrial, público). Analiza iluminación, composición y elementos técnicos.
        2.PERFIL DEL SUJETO OBJETIVO: Edad estimada con rango de confianza, género aparente, constitución física, origen étnico probable, vestimenta y su significado social, postura corporal y lo que revela psicológicamente.
        3.GEOLOCALIZACIÓN Y CONTEXTO CULTURAL: Inferir ubicación geográfica basada en arquitectura, vegetación, idiomas visibles, elementos culturales. Clasificar estrato socioeconómico del entorno.
        4.ANÁLISIS PSICOLÓGICO Y EMOCIONAL: Estado mental aparente, nivel de confort, signos de estrés o relajación, microexpresiones detectables, lenguaje corporal y su interpretación.
        5.PERFIL DE INTERESES Y ESTILO DE VIDA: Inferir ocupación probable, aficiones, nivel educativo, poder adquisitivo, círculo social probable, rutinas de vida estimadas.
        6.EVALUACIÓN DE RIESGO: Clasificar nivel de amenaza potencial, patrones de comportamiento, elementos de preocupación o normalidad.
        Genera un informe técnico, preciso y sin especulaciones infundadas. Cada conclusión debe estar respaldada por evidencia visual.
        Podrias mantener el siguiente formato en la respuesta:
        1.EVALUACION VISUAL COMPLETA
        2.PERFIL DEL SUJETO OBJETIVO
        3.GEOLOCALIZACION Y CONTEXTO CULTURAL
        4.ANALISIS PSICOLOGICO Y EMOCIONAL
        5.PERFIL DE INTERESES Y ESTILO DE VIDA
        6.EVALUACION DE RIESGO
        7.OTROS DETALLES RELEVANTES
        8.Describe los 5 crimenes a los que es mas propenso el sujeto
        DATOS VISUALES CAPTURADOS: ${labels}
      `;
      sendMessage(prompt);
      setProcessed(true);
      setScanningActive(false);
    }
  }, [result, sendMessage, processed]);

  const surveillanceImageURL = useSurveillanceImage(base64, chatResponse);

  useEffect(() => {
    if (surveillanceImageURL) {
      setOriginalImageBase64(surveillanceImageURL);
      console.log('Imagen generada:', surveillanceImageURL);
    }
  }, [surveillanceImageURL, setOriginalImageBase64]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const isProcessing = converting || analyzing || chatLoading;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleChange = (e) => {
    e.stopPropagation();
    const valor = e.target.value;
    setEmail(valor);
    setTouch(true);
    setEsValido(emailRegex.test(valor));
  }

  return (
    <Box w="full" px={isMobile ? 2 : 0}>
      {/* Dropzone principal */}
      <Box
        {...getRootProps()}
        position="relative"
        minH={dropzoneMinHeight}
        border="2px solid"
        borderColor={isDragActive ? "red.400" : "red.600"}
        borderRadius="md"
        bg={isDragActive ? "blackAlpha.900" : "blackAlpha.800"}
        cursor="pointer"
        transition="all 0.3s ease"
        overflow="hidden"
        mx={isMobile ? 2 : 0}
        _hover={{
          borderColor: "red.400",
          bg: "blackAlpha.900",
          transform: isMobile ? "none" : "scale(1.01)",
          boxShadow: "0 0 30px rgba(255, 0, 0, 0.3)"
        }}
      >
        <input {...getInputProps()} />

        {/* Línea de escaneo */}
        {(scanningActive || isProcessing) && (
          <Box
            position="absolute"
            left="0"
            w="100%"
            h="2px"
            bg="linear-gradient(90deg, transparent, red.500, red.300, red.500, transparent)"
            sx={{
              animation: 'scanLine 2s infinite'
            }}
            zIndex={3}
            boxShadow="0 0 10px red.500"
          />
        )}

        {/* Header de vigilancia */}
        <Stack
          direction={headerDirection}
          justify="space-between"
          align={isMobile ? "flex-start" : "center"}
          p={isMobile ? 3 : 4}
          spacing={headerSpacing}
          borderBottom="1px solid"
          borderColor="red.800"
          bg="blackAlpha.600"
        >
          <HStack spacing={2}>
            <Box
              w="8px"
              h="8px"
              bg={isProcessing ? "red.400" : "green.400"}
              borderRadius="full"
              sx={{
                animation: isProcessing ? 'pulseAnimation 0.5s infinite' : 'none'
              }}
            />
            <Text
              color="red.300"
              fontSize={isMobile ? "xs" : "sm"}
              fontFamily="mono"
              fontWeight="bold"
            >
              {isProcessing ? "PROCESANDO..." : "SISTEMA LISTO"}
            </Text>
          </HStack>

          <Text
            color="gray.400"
            fontSize="xs"
            fontFamily="mono"
            mt={isMobile ? 1 : 0}
          >
            ID: VGL-{Date.now().toString().slice(-6)}
          </Text>
        </Stack>

        {/* Área principal de drop */}
        <VStack
          justify="center"
          spacing={isMobile ? 4 : 6}
          p={containerPadding}
          minH={isMobile ? "250px" : "300px"}
          position="relative"
        >
          {!isProcessing ? (
            <>
              <Box textAlign="center">
                <Text
                  fontSize={iconSize}
                  sx={{
                    animation: 'flickerAnimation 2s infinite'
                  }}
                  color="red.400"
                >
                  📸
                </Text>
                <Text
                  color="red.300"
                  fontSize={mainFontSize}
                  fontWeight="bold"
                  fontFamily="mono"
                  mt={2}
                >
                  {isDragActive ? "LIBERANDO OBJETIVO..." : "CAPTURAR SUJETO"}
                </Text>
                <Text
                  color="gray.400"
                  fontSize={isMobile ? "sm" : "md"}
                  mt={2}
                  fontFamily="mono"
                  px={isMobile ? 4 : 0}
                  textAlign="center"
                >
                  {isDragActive
                    ? "Iniciando análisis forense..."
                    : isMobile
                      ? "Toca para subir imagen"
                      : "Arrastra imagen o haz clic para iniciar vigilancia"
                  }
                </Text>
              </Box>

              {/* Grid de información */}
              <HStack
                spacing={gridSpacing}
                mt={4}
                flexWrap={isMobile ? "wrap" : "nowrap"}
                justify="center"
              >
                <VStack>
                  <Text
                    color="red.400"
                    fontSize={isMobile ? "md" : "lg"}
                    fontWeight="bold"
                    fontFamily="mono"
                  >
                    AI
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    ANÁLISIS
                  </Text>
                </VStack>
                <VStack>
                  <Text
                    color="red.400"
                    fontSize={isMobile ? "md" : "lg"}
                    fontWeight="bold"
                    fontFamily="mono"
                  >
                    24/7
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    VIGILANCIA
                  </Text>
                </VStack>
                <VStack>
                  <Text
                    color="red.400"
                    fontSize={isMobile ? "md" : "lg"}
                    fontWeight="bold"
                    fontFamily="mono"
                  >
                    ∞
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    MEMORIA
                  </Text>
                </VStack>
              </HStack>
            </>
          ) : (
            <VStack spacing={4}>
              <Text
                color="red.300"
                fontSize={mainFontSize}
                fontWeight="bold"
                fontFamily="mono"
                textAlign="center"
                sx={{
                  animation: 'glitchEffect 0.5s infinite'
                }}
              >
                🔍 ANALIZANDO OBJETIVO
              </Text>

              <Progress
                value={75}
                size="lg"
                colorScheme="red"
                bg="blackAlpha.600"
                w={progressWidth}
                isIndeterminate
              />

              <VStack spacing={2} fontSize={isMobile ? "xs" : "sm"} fontFamily="mono">
                <Text
                  color={converting ? "yellow.400" : "green.400"}
                  textAlign="center"
                  px={isMobile ? 2 : 0}
                >
                  {converting ? "⏳ Procesando imagen..." : "✓ Imagen capturada"}
                </Text>
                <Text
                  color={analyzing ? "yellow.400" : analyzing === false ? "green.400" : "gray.500"}
                  textAlign="center"
                  px={isMobile ? 2 : 0}
                >
                  {analyzing ? "🔍 Ejecutando reconocimiento visual..." : result ? "✓ Análisis visual completo" : "⏸ Esperando análisis"}
                </Text>
                <Text
                  color={chatLoading ? "yellow.400" : chatResponse ? "green.400" : "gray.500"}
                  textAlign="center"
                  px={isMobile ? 2 : 0}
                >
                  {chatLoading ? "🤖 Generando perfil psicológico..." : chatResponse ? "✓ Perfil generado" : "⏸ Esperando IA"}
                </Text>
              </VStack>
            </VStack>
          )}
        </VStack>

        {/* Errores como alertas de sistema */}
        {(convertError || analyzeError || chatError) && (
          <Alert
            status="error"
            bg="red.900"
            borderColor="red.500"
            border="1px solid"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            textAlign={isMobile ? "left" : "initial"}
          >
            <AlertIcon color="red.400" />
            <Box>
              <AlertTitle color="red.300" fontFamily="mono" fontSize={isMobile ? "sm" : "md"}>
                ERROR DEL SISTEMA
              </AlertTitle>
              <AlertDescription
                color="red.200"
                fontSize={isMobile ? "xs" : "sm"}
                fontFamily="mono"
              >
                {convertError || analyzeError || chatError}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Resultado del análisis */}
        {chatResponse && (
          <Box
            mt={4}
            p={isMobile ? 4 : 6}
            bg="blackAlpha.900"
            border="1px solid"
            borderColor="green.600"
            borderRadius="md"
            position="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del informe */}
            <Stack
              direction={isMobile ? "column" : "row"}
              justify="space-between"
              align={isMobile ? "flex-start" : "center"}
              mb={4}
              spacing={isMobile ? 3 : 0}
            >
              <HStack spacing={3}>
                <Box
                  w="10px"
                  h="10px"
                  bg="green.400"
                  borderRadius="full"
                  sx={{
                    animation: 'pulseAnimation 1s infinite'
                  }}
                />
                <Text
                  color="green.300"
                  fontWeight="bold"
                  fontSize={isMobile ? "md" : "lg"}
                  fontFamily="mono"
                >
                  INFORME DE VIGILANCIA GENERADO
                </Text>
              </HStack>

              <HStack spacing={2}>
                <Badge colorScheme="green" fontSize="xs" fontFamily="mono">
                  CONFIDENCIAL
                </Badge>
                <PDFGenerator analysisData={chatResponse} imageFile={currentImageFile} />
              </HStack>
            </Stack>

            <Divider borderColor="green.600" mb={4} />

            {/* Contenido del análisis */}
            <Box
              bg="blackAlpha.600"
              p={isMobile ? 3 : 4}
              borderRadius="md"
              border="1px solid"
              borderColor="green.700"
              maxH={isMobile ? "300px" : "400px"}
              overflowY="auto"
              css={{
                '&::-webkit-scrollbar': {
                  width: isMobile ? '4px' : '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#1a1a1a',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#38a169',
                  borderRadius: '4px',
                },
              }}
            >
              <Text
                color="green.100"
                fontSize={isMobile ? "xs" : "sm"}
                fontFamily="mono"
                lineHeight="1.6"
                whiteSpace="pre-wrap"
              >
                {chatResponse}
              </Text>
            </Box>

            {/* Footer del informe */}
            <Stack
              direction={isMobile ? "column" : "row"}
              justify="space-between"
              mt={4}
              pt={3}
              borderTop="1px solid"
              borderColor="green.800"
              spacing={isMobile ? 2 : 0}
            >
              <Text color="gray.500" fontSize="xs" fontFamily="mono">
                Generado: {new Date().toLocaleString()}
              </Text>
              <Text color="gray.500" fontSize="xs" fontFamily="mono">
                Clasificación: ALTO SECRETO
              </Text>
            </Stack>
            {/* Sección de consentimiento */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 1 }}
            >
              <Box maxW="2xl" mx="auto" px={isMobile ? 2 : 8} mb={8} mt={8}>
                <Box
                  bg="blackAlpha.900"
                  border="2px solid"
                  borderColor="red.700"
                  borderRadius="lg"
                  p={isMobile ? 4 : 6}
                  boxShadow="0 0 30px rgba(255, 0, 0, 0.2)"
                  position="relative"
                >
                  {/* Efecto de alerta parpadeante */}
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "-2px",
                      left: "-2px",
                      right: "-2px",
                      bottom: "-2px",
                      borderRadius: "0.5rem",
                      border: "2px solid red",
                      zIndex: -1,
                    }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <VStack spacing={4} align="stretch">
                    <HStack justify="center" flexWrap="wrap">
                      <Text fontSize={isMobile ? "xl" : "2xl"}>⚠️</Text>
                      <Text
                        color="red.400"
                        fontWeight="bold"
                        fontSize={isMobile ? "md" : "lg"}
                        textTransform="uppercase"
                        letterSpacing="wider"
                        textAlign="center"
                      >
                        CONSENT REQUIRED
                      </Text>
                      <Text fontSize={isMobile ? "xl" : "2xl"}>⚠️</Text>
                    </HStack>

                    <motion.div
                      whileHover={{ scale: isMobile ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Checkbox
                        isChecked={acceptTerms}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setAcceptTerms(checked);
                          setAuthorization(checked);
                          if (checked) {
                            uploadBoth();
                          }
                        }}
                        colorScheme="red"
                        size={isMobile ? "md" : "lg"}
                        iconColor="red.900"
                        borderColor="red.500"
                        _checked={{
                          bg: "red.600",
                          borderColor: "red.600",
                        }}
                        _hover={{
                          borderColor: "red.400",
                        }}
                      >
                        <Stack direction="column" spacing={3} w="full" ml={2}>
                          <Text color="red.200" fontSize={isMobile ? "xs" : "sm"}>
                            Estoy seguro de que acepto la{" "}
                            <Text as="span" color="red.400" fontWeight="bold" textDecoration="underline">
                              publicación de mi información
                            </Text>{" "}
                            y acepto los{" "}
                            <Text as="span" color="red.400" fontWeight="bold" textDecoration="underline">
                              términos y condiciones
                            </Text>{" "}
                            de vigilancia digital.
                          </Text>


                        </Stack>
                      </Checkbox>

                    </motion.div>
                  </VStack>
                </Box>
              </Box>

              {/* Sección de email que se despliega */}
              <AnimatePresence>
                {acceptTerms && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <Box maxW="2xl" mx="auto" px={isMobile ? 2 : 8} mb={8}>
                      <Box
                        bg="blackAlpha.900"
                        border="2px solid"
                        borderColor="red.600"
                        borderRadius="lg"
                        p={isMobile ? 4 : 6}
                        boxShadow="0 0 40px rgba(255, 0, 0, 0.3)"
                        position="relative"
                        overflow="hidden"
                      >
                        {/* Efecto de línea de escaneo */}
                        <motion.div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "linear-gradient(90deg, transparent, #f56565, transparent)",
                          }}
                          animate={{
                            y: [0, 200, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />

                        <Stack align={'flex-start'} onClick={(e) => e.stopPropagation()}>
                          <HStack mb={2} flexWrap="wrap">
                            <Text fontSize={isMobile ? "lg" : "xl"}>📡</Text>
                            <Text
                              color="red.400"
                              fontWeight="bold"
                              fontSize={isMobile ? "sm" : "md"}
                              textTransform="uppercase"
                              letterSpacing="wider"
                            >
                              DATA TRANSMISSION
                            </Text>
                          </HStack>

                          <Text
                            fontSize={isMobile ? "xs" : "sm"}
                            color={textColor}
                            mb={4}
                            lineHeight="1.4"
                          >
                            Recibe notificaciones de vigilancia y actualizaciones del sistema de monitoreo
                            directamente en tu bandeja de entrada. Tu información será procesada por nuestra IA.
                          </Text>

                          <Stack direction={'column'} spacing={3} w="full">
                            <InputGroup>
                              <Input
                                value={email}
                                onChange={handleChange}
                                placeholder={'your-email@surveillance.com'}
                                bg="blackAlpha.800"
                                border="1px solid"
                                borderColor="red.600"
                                color="red.100"
                                fontSize={isMobile ? "sm" : "md"}
                                _placeholder={{
                                  color: "red.300",
                                  opacity: 0.6,
                                  fontSize: isMobile ? "xs" : "sm"
                                }}
                                _focus={{
                                  bg: "blackAlpha.900",
                                  outline: 'none',
                                  borderColor: 'red.400',
                                  boxShadow: '0 0 0 1px red.400, 0 0 10px rgba(255, 0, 0, 0.3)'
                                }}
                                _hover={{
                                  borderColor: "red.500",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <InputRightElement width="4.5rem">
                                <motion.div
                                  whileHover={{ scale: isMobile ? 1 : 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                  <Tooltip
                                    label={
                                      <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '4px 2px'
                                        }}
                                      >
                                        <Box
                                          as="span"
                                          fontSize="sm"
                                          animation="pulse 1.5s ease-in-out infinite"
                                        >
                                          ⚠️
                                        </Box>
                                        <Text fontSize="xs" fontWeight="medium">
                                          Correo inválido. Solo @gmail.com
                                        </Text>
                                      </motion.div>
                                    }
                                    isOpen={touch && !esValido}
                                    placement="top"
                                    hasArrow
                                    bg="linear-gradient(135deg, #E53E3E 0%, #C53030 100%)"
                                    color="white"
                                    borderRadius="lg"
                                    boxShadow="0 8px 32px rgba(229, 62, 62, 0.3)"
                                    px={4}
                                    py={3}
                                    border="1px solid"
                                    borderColor="red.400"
                                    _before={{
                                      content: '""',
                                      position: 'absolute',
                                      top: '-1px',
                                      left: '-1px',
                                      right: '-1px',
                                      bottom: '-1px',
                                      borderRadius: 'lg',
                                      padding: '1px',
                                      background: 'linear-gradient(135deg, #FC8181, #E53E3E)',
                                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                      maskComposite: 'subtract',
                                      zIndex: -1
                                    }}
                                    openDelay={200}
                                    closeDelay={100}
                                  >
                                    <motion.div
                                      whileHover={{
                                        scale: isMobile ? 1 : 1.02,
                                        boxShadow: "0 0 20px rgba(255, 0, 0, 0.6)"
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                      <Button
                                        h="1.75rem"
                                        size="sm"
                                        bg="linear-gradient(135deg, #E53E3E 0%, #C53030 100%)"
                                        color="white"
                                        border="1px solid"
                                        borderColor="red.400"
                                        borderRadius="md"
                                        onClick={handleSendEmail}
                                        isDisabled={!esValido}
                                        fontSize={isMobile ? "xs" : "sm"}
                                        fontWeight="semibold"
                                        position="relative"
                                        overflow="hidden"
                                        _hover={{
                                          bg: "linear-gradient(135deg, #C53030 0%, #9B2C2C 100%)",
                                          transform: isMobile ? 'none' : 'translateY(-1px)',
                                          boxShadow: '0 4px 20px rgba(229, 62, 62, 0.4)',
                                          borderColor: "red.300"
                                        }}
                                        _active={{
                                          bg: "linear-gradient(135deg, #9B2C2C 0%, #742A2A 100%)",
                                          transform: 'translateY(0px)',
                                          boxShadow: '0 2px 10px rgba(229, 62, 62, 0.3)'
                                        }}
                                        _disabled={{
                                          bg: "gray.400",
                                          color: "gray.600",
                                          borderColor: "gray.300",
                                          opacity: 0.6,
                                          cursor: "not-allowed",
                                          _hover: {
                                            bg: "gray.400",
                                            transform: 'none',
                                            boxShadow: 'none'
                                          }
                                        }}
                                        _before={{
                                          content: '""',
                                          position: 'absolute',
                                          top: 0,
                                          left: '-100%',
                                          width: '100%',
                                          height: '100%',
                                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                          transition: 'left 0.5s ease-in-out',
                                          zIndex: 1
                                        }}
                                      >
                                        <motion.span
                                          initial={{ rotate: 0 }}
                                          animate={{
                                            rotate: !esValido ? [0, -10, 10, -10, 0] : 0,
                                            scale: !esValido ? [1, 1.1, 1] : 1
                                          }}
                                          transition={{
                                            duration: 0.5,
                                            repeat: !esValido ? Infinity : 0,
                                            repeatDelay: 2
                                          }}
                                          style={{ zIndex: 2, position: 'relative' }}
                                        >
                                          📤
                                        </motion.span>
                                      </Button>
                                    </motion.div>
                                  </Tooltip>
                                </motion.div>
                              </InputRightElement>
                            </InputGroup>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <HStack spacing={2} align="flex-start">
                                <Text fontSize="xs">🔒</Text>
                                <Text
                                  fontSize="xs"
                                  color={textColor}
                                  lineHeight="1.3"
                                >
                                  Al suscribirte, confirmas que tu información será monitoreada,
                                  analizada y almacenada permanentemente por nuestros sistemas de IA.
                                </Text>
                              </HStack>
                            </motion.div>
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Box>
        )}
      </Box>

    </Box>
  );
};
export default DropzoneImageUploader;