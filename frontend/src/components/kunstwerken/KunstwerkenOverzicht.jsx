import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const KunstwerkCard = ({ kunstwerk }) => {
  const bg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box 
      p={5} 
      shadow="md" 
      borderWidth="1px" 
      borderRadius="lg" 
      bg={bg}
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Box 
        height="200px" 
        bg="gray.200" 
        mb={4} 
        borderRadius="md"
        backgroundImage={kunstwerk.afbeelding ? `url(${kunstwerk.afbeelding})` : 'none'}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Heading fontSize="xl" mb={2}>{kunstwerk.titel}</Heading>
      <Text fontSize="sm" color="gray.500" mb={2}>{kunstwerk.kunstenaar}</Text>
      <Text fontSize="sm" mb={3} noOfLines={2}>{kunstwerk.beschrijving}</Text>
      <Button as={Link} to={`/kunstwerken/${kunstwerk.id}`} colorScheme="blue" size="sm">
        Bekijken
      </Button>
    </Box>
  );
};

const KunstwerkenOverzicht = () => {
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const kunstwerken = [
    {
      id: 1,
      titel: 'Zonsondergang aan zee',
      kunstenaar: 'Anna de Vries',
      beschrijving: 'Een prachtig schilderij van een zonsondergang aan de Nederlandse kust.',
      afbeelding: null
    },
    {
      id: 2,
      titel: 'Abstracte compositie #5',
      kunstenaar: 'Pieter Jansen',
      beschrijving: 'Een abstracte compositie met geometrische vormen in blauw, paars en groen.',
      afbeelding: null
    },
    {
      id: 3,
      titel: 'Stadsgezicht Amsterdam',
      kunstenaar: 'Marieke Bakker',
      beschrijving: 'Een gedetailleerd stadsgezicht van de grachten van Amsterdam.',
      afbeelding: null
    },
    {
      id: 4,
      titel: 'Bronzen sculptuur',
      kunstenaar: 'Thomas Visser',
      beschrijving: 'Een moderne bronzen sculptuur geïnspireerd door natuurlijke vormen.',
      afbeelding: null
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Kunstwerken</Heading>
        <Button as={Link} to="/kunstwerken/nieuw" colorScheme="green">
          Nieuw kunstwerk
        </Button>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {kunstwerken.map(kunstwerk => (
          <KunstwerkCard key={kunstwerk.id} kunstwerk={kunstwerk} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default KunstwerkenOverzicht;
