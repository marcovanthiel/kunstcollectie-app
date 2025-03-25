import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button, useColorModeValue, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const KunstenaarCard = ({ kunstenaar }) => {
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
        backgroundImage={kunstenaar.portretfoto ? `url(${kunstenaar.portretfoto})` : 'none'}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Heading fontSize="xl" mb={2}>{kunstenaar.naam}</Heading>
      <Text fontSize="sm" color="gray.500" mb={2}>{kunstenaar.land}</Text>
      <Badge colorScheme="purple" mb={3}>{kunstenaar.aantal_kunstwerken} kunstwerken</Badge>
      <Text fontSize="sm" mb={3} noOfLines={2}>{kunstenaar.biografie}</Text>
      <Button as={Link} to={`/kunstenaars/${kunstenaar.id}`} colorScheme="purple" size="sm">
        Bekijken
      </Button>
    </Box>
  );
};

const KunstenaarsOverzicht = () => {
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const kunstenaars = [
    {
      id: 1,
      naam: 'Anna de Vries',
      land: 'Nederland',
      geboortedatum: '1975-03-15',
      biografie: 'Anna de Vries is een Nederlandse kunstenaar die bekend staat om haar kleurrijke landschappen en zeegezichten.',
      portretfoto: null,
      aantal_kunstwerken: 5
    },
    {
      id: 2,
      naam: 'Pieter Jansen',
      land: 'België',
      geboortedatum: '1982-07-22',
      biografie: 'Pieter Jansen is een Belgische abstracte kunstenaar wiens werk wordt gekenmerkt door geometrische vormen en felle kleuren.',
      portretfoto: null,
      aantal_kunstwerken: 3
    },
    {
      id: 3,
      naam: 'Marieke Bakker',
      land: 'Nederland',
      geboortedatum: '1968-11-05',
      biografie: 'Marieke Bakker is gespecialiseerd in stadsgezichten en architecturale werken met een fotorealistische stijl.',
      portretfoto: null,
      aantal_kunstwerken: 7
    },
    {
      id: 4,
      naam: 'Thomas Visser',
      land: 'Duitsland',
      geboortedatum: '1990-02-18',
      biografie: 'Thomas Visser is een opkomende beeldhouwer die werkt met brons en andere metalen om organische vormen te creëren.',
      portretfoto: null,
      aantal_kunstwerken: 2
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Kunstenaars</Heading>
        <Button as={Link} to="/kunstenaars/nieuw" colorScheme="green">
          Nieuwe kunstenaar
        </Button>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {kunstenaars.map(kunstenaar => (
          <KunstenaarCard key={kunstenaar.id} kunstenaar={kunstenaar} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default KunstenaarsOverzicht;
