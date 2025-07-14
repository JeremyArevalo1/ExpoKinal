import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
  Image,
  Badge,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useHaveIBeenPwned } from "../shared/hooks";

const CheckEmail = () => {
  const [email, setEmail] = useState("");
  const [esValido, setEsValido] = useState(false);
  const [touch, setTouch] = useState(false);
  const [breachData, setBreachData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const toast = useToast();
  const { checkEmail } = useHaveIBeenPwned();

  // Configuración responsiva
  const stackDirection = useBreakpointValue({ base: "column", md: "row" });
  const imageSize = useBreakpointValue({ base: "100px", md: "120px" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });
  const containerMaxW = useBreakpointValue({ base: "100%", md: "600px" });
  const cardPadding = useBreakpointValue({ base: 2, md: 4 });
  const badgeStackDirection = useBreakpointValue({ base: "column", sm: "row" });

  useEffect(() => {
    let timer;
    if (loading) {
      setScanProgress(0);
      setIsScanning(true);
      setShowResults(false);

      timer = setInterval(() => {
        setScanProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(timer);
            setIsScanning(false);
            setShowResults(true);
            setLoading(false);
            return 100;
          }
          return newProgress;
        });
      }, 50);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [loading]);

  const handleCheckEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setScanProgress(0);
    setShowResults(false);

    try {
      const data = await checkEmail(email);
      console.log('Datos completos:', data);
      setBreachData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al verificar el correo electrónico",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      setIsScanning(false);
    }
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleChange = (e) => {
    const valor = e.target.value;
    setEmail(valor);
    setTouch(true);
    setEsValido(emailRegex.test(valor));
  }

  return (
    <Box px={4}>
      <VStack spacing={6} maxW={containerMaxW} mx="auto">
        <Heading size={headingSize} color="red.400" textAlign="center">
          Verifica si tu información ha sido filtrada
        </Heading>

        <Input
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChange={handleChange}
          bg="blackAlpha.800"
          borderColor="red.500"
          _hover={{ borderColor: "red.400" }}
          _focus={{ borderColor: "red.300" }}
          size="lg"
        />
        {touch && !esValido && (
          <Text color="red.400" fontSize="sm" mt="2">
            Correo inválido. Verifique el formato.
          </Text>
        )}
        <Button
          colorScheme="red"
          onClick={handleCheckEmail}
          isLoading={loading}
          loadingText="Analizando..."
          isDisabled={!esValido || isScanning}
          w="full"
          size="lg"
          mt="4"
        >
          Analizar
        </Button>

        {isScanning && (
          <VStack spacing={4} w="full">
            <Alert
              status="warning"
              bg="rgba(255,0,0,0.1)"
              border="1px solid"
              borderColor="red.500"
              borderRadius="md"
            >
              <AlertIcon color="red.500" />
              <Box>
                <AlertTitle color="red.400">VIGILANCIA ACTIVA</AlertTitle>
                <AlertDescription color="gray.300">
                  Datos siendo analizados. Privacidad no garantizada.
                </AlertDescription>
              </Box>
            </Alert>

            <Box w="full">
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
        )}

        {showResults && breachData && !isScanning && (
          <Card
            bg="blackAlpha.900"
            borderColor="red.500"
            borderWidth="1px"
            w="full"
          >
            <CardBody p={cardPadding}>
              <VStack spacing={4} align="stretch">
                <Heading size="md" color="red.400" textAlign="center">
                  Resultados del Análisis
                </Heading>

                {breachData.ExposedBreaches?.breaches_details?.length > 0 ? (
                  breachData.ExposedBreaches.breaches_details.map((breach, index) => (
                    <Box
                      key={index}
                      p={cardPadding}
                      borderWidth="1px"
                      borderColor="red.800"
                      borderRadius="md"
                    >
                      <Stack direction={stackDirection} spacing={4}>
                        <Box
                          p={cardPadding}
                          bg="whiteAlpha.200"
                          borderRadius="xl"
                          border="2px solid"
                          borderColor="red.800"
                          minW={imageSize}
                          minH={imageSize}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Image
                            src={breach.logo}
                            alt={breach.breach}
                            boxSize={imageSize}
                            objectFit="contain"
                            fallbackSrc="https://via.placeholder.com/120"
                          />
                        </Box>
                        <VStack align="start" spacing={2} flex={1}>
                          <Heading size="sm" color="red.300">
                            {breach.breach}
                          </Heading>
                          <Text fontSize="sm" color="gray.400">
                            {breach.details}
                          </Text>
                          <Stack direction={badgeStackDirection} spacing={2} wrap="wrap">
                            <Badge colorScheme="red">Fecha: {breach.xposed_date}</Badge>
                            <Badge colorScheme="red">Registros: {breach.xposed_records}</Badge>
                            <Badge colorScheme={breach.password_risk === "hardtocrack" ? "green" : "red"}>
                              Riesgo: {
                                breachData.ExposedBreaches.BreachMetrics.risk[0]
                                  ? `${breachData.ExposedBreaches.BreachMetrics.risk[0].risk_label} (${breachData.ExposedBreaches.BreachMetrics.risk[0].risk_score} %)`
                                  : "No disponible"
                              }
                            </Badge>
                          </Stack>
                          <Text fontSize="sm" color="red.200">
                            Datos expuestos: {breach.xposed_data}
                          </Text>
                        </VStack>
                      </Stack>
                    </Box>
                  ))
                ) : (
                  <Box
                    p={cardPadding}
                    borderWidth="1px"
                    borderColor="green.500"
                    borderRadius="md"
                    bg="blackAlpha.900"
                    textAlign="center"
                  >
                    <Text fontSize="xl" color="green.400" fontWeight="bold" mb={2}>
                      🛡️ Estás seguro por ahora...
                    </Text>
                    <Text fontSize="md" color="green.200">
                      No se encontraron brechas de seguridad asociadas a este correo electrónico.
                    </Text>
                    <Text fontSize="sm" color="green.100" mt={2} fontStyle="italic">
                      Recuerda mantener buenas prácticas de seguridad y cambiar tus contraseñas regularmente.
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Box>
  );
};

export default CheckEmail; 