// Login component voor authenticatie
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Container,
  Image
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, wachtwoord);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Er is een fout opgetreden bij het inloggen');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg={bgColor}
        boxShadow="lg"
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing="6" align="center" w="full">
          <Image 
            src="/logo.png" 
            alt="Kunstcollectie Logo" 
            maxW="200px" 
            fallbackSrc="https://via.placeholder.com/200x80?text=Kunstcollectie"
          />
          
          <Heading size="lg" mb="6">Inloggen</Heading>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing="5" align="flex-start" w="full">
              <FormControl isRequired>
                <FormLabel htmlFor="email">E-mailadres</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="uw@email.nl"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel htmlFor="wachtwoord">Wachtwoord</FormLabel>
                <InputGroup>
                  <Input
                    id="wachtwoord"
                    type={showPassword ? 'text' : 'password'}
                    value={wachtwoord}
                    onChange={(e) => setWachtwoord(e.target.value)}
                    placeholder="Uw wachtwoord"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      onClick={toggleShowPassword}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                w="full"
              >
                Inloggen
              </Button>
            </VStack>
          </form>
          
          <Text fontSize="sm" color="gray.500" mt="4">
            Neem contact op met de beheerder als u geen toegang heeft tot het systeem.
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
