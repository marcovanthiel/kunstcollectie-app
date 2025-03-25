import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Button, 
  useColorModeValue, 
  Badge,
  Flex,
  Icon
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocatieCard = ({ locatie }) => {
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
        height="150px" 
        bg="gray.200" 
        mb={4} 
        borderRadius="md"
        position="relative"
        overflow="hidden"
      >
        {/* Hier zou een kaart component komen */}
        <Flex 
          position="absolute" 
          top="0" 
          left="0" 
          right="0" 
          bottom="0" 
          alignItems="center" 
          justifyContent="center"
          bg="rgba(0,0,0,0.1)"
        >
          <Icon as={FaMapMarkerAlt} w={10} h={10} color="green.500" />
        </Flex>
      </Box>
      <Heading fontSize="xl" mb={2}>{locatie.naam}</Heading>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {locatie.adres}, {locatie.plaats}
      </Text>
      <Badge colorScheme="green" mb={3}>{locatie.type}</Badge>
      <Text fontSize="sm" mb={3}>{locatie.aantal_kunstwerken} kunstwerken</Text>
      <Button as={Link} to={`/locaties/${locatie.id}`} colorScheme="green" size="sm">
        Bekijken
      </Button>
    </Box>
  );
};

const LocatiesOverzicht = () => {
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const locaties = [
    {
      id: 1,
      naam: 'Hoofdkantoor',
      adres: 'Voorbeeldstraat 123',
      postcode: '1234 AB',
      plaats: 'Amsterdam',
      land: 'Nederland',
      type: 'Kantoor',
      aantal_kunstwerken: 6
    },
    {
      id: 2,
      naam: 'Bijkantoor Rotterdam',
      adres: 'Testlaan 45',
      postcode: '3012 BC',
      plaats: 'Rotterdam',
      land: 'Nederland',
      type: 'Kantoor',
      aantal_kunstwerken: 3
    },
    {
      id: 3,
      naam: 'Galerie Noord',
      adres: 'Kunststraat 78',
      postcode: '9712 GH',
      plaats: 'Groningen',
      land: 'Nederland',
      type: 'Galerie',
      aantal_kunstwerken: 12
    },
    {
      id: 4,
      naam: 'Externe opslag',
      adres: 'Magazijnweg 10',
      postcode: '5651 KL',
      plaats: 'Eindhoven',
      land: 'Nederland',
      type: 'Opslag',
      aantal_kunstwerken: 8
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Locaties</Heading>
        <Button as={Link} to="/locaties/nieuw" colorScheme="green">
          Nieuwe locatie
        </Button>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {locaties.map(locatie => (
          <LocatieCard key={locatie.id} locatie={locatie} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LocatiesOverzicht;
