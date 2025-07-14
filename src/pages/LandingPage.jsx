import DropzoneImageUploader from "../components/dropZonee";
import SharePanel from "../components/SharePanel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WatchingEye from "../components/WatchingEye";
import SimpleNavbar from "../components/Navbar";
import CheckEmail from "../components/CheckEmail";
import {
  Grid,
  GridItem,
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  Icon,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";

// Componente de texto que aparece y desaparece
const GlitchText = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.8, 1] }}
      transition={{
        delay,
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const [showWarning, setShowWarning] = useState(false);

  // Responsive values
  const gridTemplate = useBreakpointValue({
    base: "1fr",
    md: "2fr 1fr"
  });
  const headingSize = useBreakpointValue({
    base: "xl",
    md: "2xl"
  });
  const padding = useBreakpointValue({
    base: 4,
    md: 8
  });
  const headerPadding = useBreakpointValue({
    base: 8,
    md: 16
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowWarning(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <Box
    minH="100vh"
    bg="linear-gradient(135deg, #0f0f0f 0%, #1a0e0e 50%, #000000 100%)"
    color="white"
    position="relative"
    overflow="hidden"
  >
    {/* Ojos flotantes */}
    <Box position="absolute" top={{ base: "10%", md: "15%" }} left={{ base: "5%", md: "10%" }}>
      <WatchingEye delay={0.5} />
    </Box>
    <Box position="absolute" top={{ base: "15%", md: "20%" }} right={{ base: "5%", md: "10%" }}>
      <WatchingEye delay={1} />
    </Box>
    <Box
      position="absolute"
      bottom={{ base: "40%", md: "30%" }}
      left={{ base: "10%", md: "5%" }}
      display={{ base: "none", md: "block" }}
    >
      <WatchingEye delay={1.5} />
    </Box>
    <Box
      position="absolute"
      top={{ base: "70%", md: "60%" }}
      right={{ base: "15%", md: "20%" }}
      display={{ base: "none", md: "block" }}
    >
      <WatchingEye delay={2} />
    </Box>

    {/* Efecto de ruido */}
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      opacity="0.03"
      backgroundImage="radial-gradient(circle, #ff0000 1px, transparent 1px)"
      backgroundSize="20px 20px"
      animation="noise 0.2s infinite linear alternate"
      zIndex="0"
    />

    {/* Contenido principal */}
    <Box position="relative" zIndex="2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Box textAlign="center" pt={headerPadding} pb={8} px={4}>
          <motion.div
            animate={{ textShadow: ["0 0 10px #ff0000", "0 0 20px #ff0000", "0 0 10px #ff0000"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SimpleNavbar />
            <Heading
              as="h1"
              fontWeight="extrabold"
              color="red.400"
              mb={4}
              letterSpacing="wider"
              textTransform="uppercase"
              fontFamily="monospace"
              fontSize={{ base: "1.8rem", md: "3rem" }}
              lineHeight={{ base: "2rem", md: "3.5rem" }}
            >
              <GlitchText>We see you all time</GlitchText>
            </Heading>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
            <Text fontSize={{ base: "md", md: "lg" }} color="red.200" mb={6} fontStyle="italic" letterSpacing="wide">
              "A picture says more than a thousand secrets."
            </Text>
          </motion.div>

          <motion.div initial={{ width: 0 }} animate={{ width: "30%" }} transition={{ delay: 1.5, duration: 1 }}>
            <Divider borderColor="red.500" mx="auto" borderWidth="2px" borderRadius="md" boxShadow="0 0 10px #ff0000" />
          </motion.div>
        </Box>
      </motion.div>

      {/* Mensaje de advertencia */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <Box textAlign="center" mb={8} px={4}>
              <Box
                bg="blackAlpha.800"
                border="1px solid"
                borderColor="red.500"
                borderRadius="lg"
                p={4}
                mx="auto"
                maxW="md"
                boxShadow="0 0 20px rgba(255, 0, 0, 0.3)"
              >
                <HStack justify="center" mb={2}>
                  <Text fontSize={{ base: "xl", md: "2xl" }}>⚠️</Text>
                  <Text color="red.400" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>
                    SURVEILLANCE ACTIVE
                  </Text>
                  <Text fontSize={{ base: "xl", md: "2xl" }}>⚠️</Text>
                </HStack>
                <Text fontSize={{ base: "2xs", md: "xs" }} color="red.200" opacity={0.8}>
                  AI is analyzing. Privacy not guaranteed.
                </Text>

                <VStack spacing={3} align="stretch">
                  {[
                    "Facial Recognition: ACTIVE",
                    "Behavior Analysis: RUNNING",
                    "Data Collection: ENABLED",
                    "Privacy Mode: DISABLED",
                  ].map((status, index) => (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 + index * 0.2, duration: 0.5 }}
                    >
                      <HStack>
                        <motion.div
                          animate={{ backgroundColor: ["#ff0000", "#ff6666", "#ff0000"] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                          style={{ width: "6px", height: "6px", borderRadius: "50%" }}
                        />
                        <Text fontSize="xs" color="red.200">
                          {status}
                        </Text>
                      </HStack>
                    </motion.div>
                  ))}
                </VStack>
                <Box pt={4}>
                  <SharePanel />
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid principal */}
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 1 }}>
        <Grid templateColumns={gridTemplate} gap={{ base: 4, md: 8 }} p={padding} templateRows={{ base: "auto auto", md: "1fr" }}>
          {/* Dropzone */}
          <GridItem order={{ base: 1, md: 1 }}>
            <Box
              bg="blackAlpha.900"
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              border="1px solid"
              borderColor="red.800"
              boxShadow="0 0 30px rgba(255, 0, 0, 0.2)"
              position="relative"
              minH={{ base: "300px", md: "400px" }}
            >
              <Flex
                position="absolute"
                top={4}
                right={4}
                align="center"
                gap={2}
                bg="blackAlpha.800"
                px={3}
                py={1}
                borderRadius="full"
                border="1px solid"
                borderColor="red.500"
                zIndex={3}
              >
                <motion.div
                  animate={{ backgroundColor: ["#ff0000", "#ff6666", "#ff0000"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: "8px", height: "8px", borderRadius: "50%" }}
                />
              </Flex>
              <DropzoneImageUploader />
            </Box>
          </GridItem>

          {/* System Status */}
          <GridItem order={{ base: 2, md: 2 }}>
            <Box
              bg="blackAlpha.900"
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              border="1px solid"
              borderColor="red.800"
              h={{ base: "auto", md: "full" }}
              minH={{ base: "200px", md: "400px" }}
              boxShadow="0 0 30px rgba(255, 0, 0, 0.2)"
            >
              <VStack spacing={4} align="stretch" h="full">
                <Text
                  color="red.400"
                  fontWeight="bold"
                  fontSize={{ base: "xs", md: "sm" }}
                  textTransform="uppercase"
                  letterSpacing="wider"
                  textAlign={{ base: "center", md: "left" }}
                >
                  Desarrollado por:
                </Text>

                <VStack spacing={3} align="stretch" flex="1" justify="center">
                  {[
                    "Luis Eduardo De León",
                    "Herbert Joaquin Figueroa",
                    "Cristian Estuardo Lima",
                    "Lisandro Jimenez",
                    "Jorge Andres Peralta",
                    "Jeremy Jair Arevalo",
                  ].map((status, index) => (
                    <motion.div
                      key={status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 + index * 0.2, duration: 0.5 }}
                    >
                      <HStack spacing={{ base: 2, md: 3 }}>
                        <motion.div
                          animate={{ backgroundColor: ["#ff0000", "#ff6666", "#ff0000"] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3,
                          }}
                          style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 }}
                        />
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="red.200" lineHeight="1.2">
                          {status}
                        </Text>
                      </HStack>
                    </motion.div>
                  ))}
                </VStack>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </motion.div>

      {/* Sección final */}
      <Box py={16} px={4}>
        <Divider borderColor="red.500" mb={16} />
        <CheckEmail />
      </Box>
    </Box>

    {/* CSS animación de ruido */}
    <style jsx>{`
      @keyframes noise {
        0% { transform: translate(0, 0); }
        10% { transform: translate(-5%, -10%); }
        20% { transform: translate(-10%, 5%); }
        30% { transform: translate(5%, -15%); }
        40% { transform: translate(-5%, 10%); }
        50% { transform: translate(-10%, 5%); }
        60% { transform: translate(15%, 0%); }
        70% { transform: translate(0%, 15%); }
        80% { transform: translate(-15%, 0%); }
        90% { transform: translate(10%, 5%); }
        100% { transform: translate(5%, 0%); }
      }
    `}</style>
  </Box>
  
);
}

export default LandingPage;