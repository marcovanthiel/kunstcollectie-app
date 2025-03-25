// Layout component voor de applicatie
import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Flex 
      direction="column" 
      minH="100vh"
      bg="gray.50"
    >
      <Navigation />
      
      <Box flex="1" py={8}>
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>
      
      <Footer />
    </Flex>
  );
};

export default Layout;
