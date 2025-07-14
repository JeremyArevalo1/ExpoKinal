import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const MotionBox = motion.create(Box);

const SimpleNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [opacity, setOpacity] = useState(1);
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(1 - scrollY / 300, 0.4);
      const newBlur = Math.min(scrollY / 50, 8);
      setOpacity(newOpacity);
      setBlur(newBlur);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <MotionBox
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      position="fixed"
      top="0"
      left="0"
      width="100%"
      bg={`rgba(0, 0, 0, ${opacity * 0.85})`}
      borderBottom="1px solid"
      borderColor="red.800"
      zIndex="10"
      boxShadow="0 0 20px rgba(255, 0, 0, 0.3)"
      style={{
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        transition: "backdrop-filter 0.3s ease",
      }}
    >
      <Flex justify="space-between" align="center" p={4} px={8}>
        <Flex gap={10}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/PageProtegete")}
            style={{ cursor: "pointer" }}
          >
            <Text
              fontWeight="bold"
              fontSize="lg"
              color="red.400"
              _hover={{ color: "white" }}
              textTransform="uppercase"
              fontFamily="monospace"
            >
              Protegete
            </Text>
          </motion.div>

          
        </Flex>

        {!isHome && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: "pointer" }}
          >
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              colorScheme="red"
              variant="outline"
              aria-label="Regresar"
              borderColor="red.400"
              _hover={{ bg: "red.500", color: "white" }}
              size="md"
            />
          </motion.div>
        )}
      </Flex>
    </MotionBox>
  );
};

export default SimpleNavbar;
