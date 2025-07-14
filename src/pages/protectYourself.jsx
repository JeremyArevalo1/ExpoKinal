import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Progress,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Flex,
    Divider,
    Button
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import SimpleNavbar from '../components/Navbar';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px #ff0000; }
  50% { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; }
  100% { text-shadow: 0 0 5px #ff0000; }
`;

const scanAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const ProtectYourselfPage = () => {
    const [scanProgress, setScanProgress] = useState(0);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    setIsScanning(false);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        setIsScanning(true);
        return () => clearInterval(timer);
    }, []);

    const tips = [
        {
            id: 1,
            title: "Protege tu correo electrónico",
            content: "Cuida la contraseña de tu correo electrónico, en él hay mucha información personal con la cual pueden robarte tu identidad.",
            icon: "🔒",
            color: "red.400"
        },
        {
            id: 2,
            title: "Contraseñas seguras",
            content: "Utiliza contraseñas seguras, colocando números, símbolos, mayúsculas y minúsculas.",
            icon: "🔑",
            color: "orange.400"
        },
        {
            id: 3,
            title: "Borra tu historial",
            content: "Borra el historial de tus búsquedas en la web, puedes eliminarlo en conjunto con las cookies cada vez que cierras el navegador.",
            icon: "🗑️",
            color: "yellow.400"
        },
        {
            id: 4,
            title: "Configura perfiles privados",
            content: "Cuando configures tu perfil en las redes sociales, asegúrate que sea privado. En caso que necesites que sea público (si tienes un negocio), utiliza una cuenta para tu información personal y otra para tu cuenta pública.",
            icon: "🕵️",
            color: "green.400"
        },
        {
            id: 5,
            title: "Analiza lo que publicas",
            content: "Analiza muy bien la información e imágenes que publicas. Aunque hayas configurado tus cuentas para que solo las personas conocidas puedan acceder a ella, es muy sencillo que se filtren datos. Por esto, nunca compartas tu dirección, datos personales o bancarios.",
            icon: "🖼️",
            color: "blue.400"
        },
        {
            id: 6,
            title: "Verifica contactos",
            content: "Antes de aceptar algún seguidor o solicitud de amistad, verifica si realmente conoces a la persona.",
            icon: "✅",
            color: "purple.400"
        },
        {
            id: 7,
            title: "Sitios seguros únicamente",
            content: "Utiliza solo sitios seguros; si es una página web puedes verificarlo si empieza con HTTPS y asegúrate que sea la URL correcta o si es en redes sociales, asegúrate que sea el perfil oficial.",
            icon: "🛡️",
            color: "cyan.400"
        },
        {
            id: 8,
            title: "Búscate en Google",
            content: "Búscate en Google. Es una manera práctica de saber cuánta información se puede encontrar sobre ti, y de protegerla a partir de este momento.",
            icon: "🔍",
            color: "pink.400"
        },
        {
            id: 9,
            title: "Redes WiFi privadas",
            content: "Utiliza redes de WiFi privadas. Evita en lo posible conectarte a redes públicas, pero si lo haces, no realices transacciones bancarias o compartas datos personales, ya que estos pueden ser robados por la persona que te está compartiendo la señal.",
            icon: "📶",
            color: "teal.400"
        },
        {
            id: 10,
            title: "Actualiza tu antivirus",
            content: "Actualiza tu antivirus. Puede parecer obvio, pero es algo que te brinda una protección extra para que tus datos personales no sean robados.",
            icon: "🛡️",
            color: "red.500"
        }
    ];

    return (
        <Box
            minH="100vh"
            bg="black"
            color="white"
            position="relative"
            overflow="hidden"
        >
            <SimpleNavbar />
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity="0.1"
                backgroundImage="linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)"
                backgroundSize="50px 50px"
            />

            {isScanning && (
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    height="2px"
                    bg="linear-gradient(90deg, transparent, red.500, transparent)"
                    animation={`${scanAnimation} 2s ease-in-out infinite`}
                    zIndex="1"
                />
            )}

            <Container maxW="container.xl" py={8} pt={100} position="relative" zIndex="2">
                <VStack spacing={8} mb={12}>
                    <Box textAlign="center">
                        <Text
                            fontSize="6xl"
                            color="red.500"
                            animation={`${glowAnimation} 2s ease-in-out infinite`}
                            mb={4}
                        >
                            👁️
                        </Text>
                        <Heading
                            size="2xl"
                            color="red.500"
                            fontFamily="mono"
                            letterSpacing="wider"
                            textShadow="0 0 10px rgba(255,0,0,0.5)"
                        >
                            PROTEGE TU INFORMACIÓN
                        </Heading>
                        <Text
                            fontSize="lg"
                            color="red.300"
                            mt={2}
                            fontStyle="italic"
                        >
                            "Tu privacidad está en riesgo constante"
                        </Text>
                    </Box>

                    <Alert
                        status="warning"
                        bg="rgba(255,0,0,0.1)"
                        border="1px solid"
                        borderColor="red.500"
                        borderRadius="md"
                        maxW="md"
                    >
                        <AlertIcon color="red.500" />
                        <Box>
                            <AlertTitle color="red.400">VIGILANCIA ACTIVA</AlertTitle>
                            <AlertDescription color="gray.300">
                                Datos siendo analizados. Privacidad no garantizada.
                            </AlertDescription>
                        </Box>
                    </Alert>

                    <Box w="full" maxW="md">
                        <Text fontSize="sm" color="red.400" mb={2}>
                            Escaneando vulnerabilidades...
                        </Text>
                        <Progress
                            value={scanProgress}
                            colorScheme="red"
                            size="sm"
                            bg="gray.800"
                            borderRadius="full"
                        />
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            {scanProgress}% completado
                        </Text>
                    </Box>
                </VStack>

                <VStack spacing={6} mb={12}>
                    <Box
                        bg="rgba(20,20,20,0.8)"
                        border="1px solid"
                        borderColor="red.900"
                        borderRadius="md"
                        p={6}
                        w="full"
                    >
                        <Text fontSize="lg" lineHeight="1.8" color="gray.300">
                            Actualmente el internet es parte del día a día, las redes sociales y el correo
                            electrónico se utilizan como medios de comunicación con las demás personas.
                        </Text>
                    </Box>

                    <Box
                        bg="rgba(20,20,20,0.8)"
                        border="1px solid"
                        borderColor="red.900"
                        borderRadius="md"
                        p={6}
                        w="full"
                    >
                        <Text fontSize="lg" lineHeight="1.8" color="gray.300">
                            Debes tener en cuenta que desde el momento que navegas en la computadora o el celular,
                            estás compartiendo información constantemente y aunque no te des cuenta, estos datos
                            quedan almacenados en la red a través de las cookies.
                        </Text>
                    </Box>

                    <Badge
                        colorScheme="red"
                        fontSize="md"
                        px={6}
                        py={3}
                        bg="red.900"
                        color="red.200"
                        border="1px solid"
                        borderColor="red.500"
                        borderRadius="full"
                    >
                        10 CONSEJOS PARA CUIDAR TUS DATOS PERSONALES
                    </Badge>
                </VStack>

                <Accordion allowMultiple>
                    {tips.map((tip) => (
                        <AccordionItem
                            key={tip.id}
                            border="1px solid"
                            borderColor="red.900"
                            bg="rgba(20,20,20,0.6)"
                            mb={4}
                            borderRadius="md"
                            _hover={{
                                borderColor: "red.700",
                                bg: "rgba(30,30,30,0.8)"
                            }}
                        >
                            <AccordionButton
                                py={4}
                                _hover={{ bg: "rgba(255,0,0,0.1)" }}
                                _expanded={{ bg: "rgba(255,0,0,0.1)" }}
                            >
                                <Box flex="1" textAlign="left">
                                    <Flex align="center" gap={4}>
                                        <Box
                                            w={10}
                                            h={10}
                                            bg="red.900"
                                            borderRadius="full"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            border="1px solid"
                                            borderColor={tip.color}
                                            fontSize="lg"
                                        >
                                            <Text color={tip.color}>{tip.icon}</Text>
                                        </Box>
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                fontWeight="bold"
                                                color="red.300"
                                                fontSize="lg"
                                            >
                                                {String(tip.id).padStart(2, '0')}. {tip.title}
                                            </Text>
                                        </VStack>
                                    </Flex>
                                </Box>
                                <AccordionIcon color="red.500" />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Box ml={14}>
                                    <Text
                                        color="gray.300"
                                        lineHeight="1.7"
                                        fontSize="md"
                                    >
                                        {tip.content}
                                    </Text>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </Box>
    );
};

export default ProtectYourselfPage;