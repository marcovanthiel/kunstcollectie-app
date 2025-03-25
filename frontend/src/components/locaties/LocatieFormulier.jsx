import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Select, 
  Button, 
  Grid, 
  GridItem,
  Flex,
  Stack,
  useToast,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';

const LocatieFormulier = ({ isEditing = false }) => {
  const toast = useToast();
  
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const locatieTypes = [
    { id: 1, naam: 'Kantoor' },
    { id: 2, naam: 'Galerie' },
    { id: 3, naam: 'Opslag' },
    { id: 4, naam: 'Museum' },
    { id: 5, naam: 'Privéwoning' }
  ];
  
  // State voor formulier
  const [formData, setFormData] = useState({
    naam: '',
    adres: '',
    postcode: '',
    plaats: '',
    land: 'Nederland',
    type_id: '',
    latitude: '',
    longitude: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    // Hier zou de API call komen om de locatie op te slaan
    
    toast({
      title: isEditing ? 'Locatie bijgewerkt' : 'Locatie toegevoegd',
      description: `${formData.naam} is succesvol ${isEditing ? 'bijgewerkt' : 'toegevoegd'}.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>{isEditing ? 'Locatie bewerken' : 'Nieuwe locatie toevoegen'}</Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Locatie informatie</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl isRequired>
                  <FormLabel>Naam</FormLabel>
                  <Input 
                    name="naam" 
                    value={formData.naam} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    name="type_id" 
                    value={formData.type_id} 
                    onChange={handleChange}
                    placeholder="Selecteer type"
                  >
                    {locatieTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Adresgegevens</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={12}>
                <FormControl isRequired>
                  <FormLabel>Adres</FormLabel>
                  <Input 
                    name="adres" 
                    value={formData.adres} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 4 }}>
                <FormControl isRequired>
                  <FormLabel>Postcode</FormLabel>
                  <Input 
                    name="postcode" 
                    value={formData.postcode} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 4 }}>
                <FormControl isRequired>
                  <FormLabel>Plaats</FormLabel>
                  <Input 
                    name="plaats" 
                    value={formData.plaats} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl isRequired>
                  <FormLabel>Land</FormLabel>
                  <Input 
                    name="land" 
                    value={formData.land} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Kaartgegevens</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Breedtegraad (Latitude)</FormLabel>
                  <Input 
                    name="latitude" 
                    value={formData.latitude} 
                    onChange={handleChange} 
                    placeholder="bijv. 52.3676"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Lengtegraad (Longitude)</FormLabel>
                  <Input 
                    name="longitude" 
                    value={formData.longitude} 
                    onChange={handleChange} 
                    placeholder="bijv. 4.9041"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={12}>
                <Box 
                  height="200px" 
                  bg="gray.200" 
                  borderRadius="md" 
                  mt={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="gray.500">Kaart wordt hier weergegeven</Text>
                </Box>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Vul de coördinaten in of klik op de kaart om de locatie te selecteren
                </Text>
              </GridItem>
            </Grid>
          </Box>
          
          <Flex justifyContent="flex-end" gap={4}>
            <Button variant="outline">Annuleren</Button>
            <Button type="submit" colorScheme="green">
              {isEditing ? 'Wijzigingen opslaan' : 'Locatie toevoegen'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default LocatieFormulier;
