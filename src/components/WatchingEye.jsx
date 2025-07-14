import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Text, useColorModeValue } from '@chakra-ui/react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const WatchingEye = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const eyeRef = useRef(null);

    // Valores de movimiento suaves para los ojos
    const eyeX = useMotionValue(0);
    const eyeY = useMotionValue(0);

    // Configuración de spring para movimiento suave
    const springConfig = { damping: 20, stiffness: 300 };
    const smoothEyeX = useSpring(eyeX, springConfig);
    const smoothEyeY = useSpring(eyeY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            if (eyeRef.current) {
                const eyeRect = eyeRef.current.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;

                // Calcular el ángulo y distancia
                const deltaX = e.clientX - eyeCenterX;
                const deltaY = e.clientY - eyeCenterY;
                const angle = Math.atan2(deltaY, deltaX);
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 40);

                // Calcular posición de la pupila
                const normalizedDistance = distance / 5;
                const pupilX = Math.cos(angle) * normalizedDistance;
                const pupilY = Math.sin(angle) * normalizedDistance;

                eyeX.set(pupilX);
                eyeY.set(pupilY);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [eyeX, eyeY]);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const eyeWhite = useColorModeValue('white', 'gray.100');
    const shadowColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

    return (
        <Box
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            overflow="hidden"
        >
            {/* Partículas de fondo animadas */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: Math.random() * 4 + 2,
                        height: Math.random() * 4 + 2,
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.1, 0.8, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <VStack spacing={12}>
                {/* Contenedor del ojo */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Box
                        ref={eyeRef}
                        width="120px" // antes: 200px
                        height="54px" // antes: 90px (proporción mantenida)
                        bg={eyeWhite}
                        borderRadius="100%"
                        position="relative"
                        overflow="hidden"
                        boxShadow={`0 20px 60px ${shadowColor}, inset 0 2px 10px rgba(0,0,0,0.1)`}
                        border="4px solid rgba(255,255,255,0.2)"
                        _before={{
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                            animation: 'shine 3s infinite',
                        }}
                    >
                        {/* Iris */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                width: '72px',        // antes: 120px
                                height: '72px',
                                background: 'radial-gradient(circle,rgb(0, 0, 0) 0%,rgb(0, 0, 0) 50%,rgb(0, 0, 0) 100%)',
                                borderRadius: '50%',
                                left: '50%',
                                top: '50%',
                                x: smoothEyeX,
                                y: smoothEyeY,
                                marginLeft: '-36px', // la mitad del width
                                marginTop: '-36px',  // la mitad del height
                                boxShadow: '0 0 30px rgba(79, 172, 254, 0.4)',
                            }}
                        >
                            {/* Pupila */}
                            <Box
                                position="absolute"
                                width="30px" // antes: 50px
                                height="30px"
                                bg="black"
                                borderRadius="50%"
                                left="50%"
                                top="50%"
                                transform="translate(-50%, -50%)"
                                boxShadow="inset 0 0 20px rgba(0,0,0,0.8)"
                            >
                                {/* Reflejo en la pupila */}
                                <Box
                                    position="absolute"
                                    width="8px" // antes: 12px
                                    height="8px"
                                    bg="white"
                                    borderRadius="50%"
                                    top="10px"
                                    left="10px"
                                    opacity="0.9"
                                />
                            </Box>

                            {/* Anillos del iris */}
                            <Box
                                position="absolute"
                                width="60px" // antes: 100px
                                height="60px"
                                border="2px solid rgba(255,255,255,0.2)"
                                borderRadius="50%"
                                left="50%"
                                top="50%"
                                transform="translate(-50%, -50%)"
                            />
                            <Box
                                position="absolute"
                                width="48px" // antes: 80px
                                height="48px"
                                border="1px solid rgba(255,255,255,0.1)"
                                borderRadius="50%"
                                left="50%"
                                top="50%"
                                transform="translate(-50%, -50%)"
                            />
                        </motion.div>

                        {/* Párpados */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '12px',
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)',
                                borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                            }}
                            animate={{
                                scaleY: [1, 0.1, 1],
                            }}
                            transition={{
                                duration: 0.2,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 5 + 3,
                            }}
                        />
                    </Box>

                </motion.div>
            </VStack>
        </Box>
    );
};

export default WatchingEye;