// Footer component voor de applicatie
import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'gray.200')}
      borderTopWidth={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW={'container.xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© {new Date().getFullYear()} Kunstcollectie. Alle rechten voorbehouden.</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'}>Privacy</Link>
          <Link href={'#'}>Voorwaarden</Link>
          <Link href={'#'}>Contact</Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
