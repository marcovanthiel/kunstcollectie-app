import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  Grid, 
  GridItem,
  Flex,
  Stack,
  Divider,
  useToast,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';

const KunstenaarFormulier = ({ isEditing = false }) => {
  const toast = useToast();
  
  // State voor formulier
  const [formData, setFormData] = useState({
    naam: '',
    adres: '',
    postcode: '',
    plaats: '',
    land: '',
    telefoon: '',
    email: '',
    website: '',
    geboortedatum: '',
    overlijdensdatum: '',
    biografie: ''
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
    
    // Hier zou de API call komen om de kunstenaar op te slaan
    
    toast({
      title: isEditing ? 'Kunstenaar bijgewerkt' : 'Kunstenaar toegevoegd',
      description: `${formData.naam} is succesvol ${isEditing ? 'bijgewerkt' : 'toegevoegd'}.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>{isEditing ? 'Kunstenaar bewerken' : 'Nieuwe kunstenaar toevoegen'}</Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Persoonlijke informatie</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl isRequired>
                  <FormLabel>Naam</FormLabel>
                  <Input 
                    name="naam" 
                    value={formData.naam} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Geboortedatum</FormLabel>
                  <Input 
                    name="geboortedatum" 
                    type="date" 
                    value={formData.geboortedatum} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Overlijdensdatum</FormLabel>
                  <Input 
                    name="overlijdensdatum" 
                    type="date" 
                    value={formData.overlijdensdatum} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={12}>
                <FormControl>
                  <FormLabel>Biografie</FormLabel>
                  <Textarea 
                    name="biografie" 
                    value={formData.biografie} 
                    onChange={handleChange} 
                    rows={4}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Contactgegevens</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl>
                  <FormLabel>Adres</FormLabel>
                  <Input 
                    name="adres" 
                    value={formData.adres} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 4 }}>
                <FormControl>
                  <FormLabel>Postcode</FormLabel>
                  <Input 
                    name="postcode" 
                    value={formData.postcode} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Plaats</FormLabel>
                  <Input 
                    name="plaats" 
                    value={formData.plaats} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Land</FormLabel>
                  <Input 
                    name="land" 
                    value={formData.land} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Telefoon</FormLabel>
                  <Input 
                    name="telefoon" 
                    value={formData.telefoon} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={12}>
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>https://</InputLeftAddon>
                    <Input 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      placeholder="www.voorbeeld.nl"
                    />
                  </InputGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Portretfoto</Heading>
            
            <Box mb={4} p={4} borderWidth="2px" borderRadius="md" borderStyle="dashed" textAlign="center">
              <Button colorScheme="purple">Portretfoto uploaden</Button>
              <Text mt={2} fontSize="sm" color="gray.500">Sleep een afbeelding hierheen of klik om te uploaden</Text>
            </Box>
          </Box>
          
          <Flex justifyContent="flex-end" gap={4}>
            <Button variant="outline">Annuleren</Button>
            <Button type="submit" colorScheme="green">
              {isEditing ? 'Wijzigingen opslaan' : 'Kunstenaar toevoegen'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default KunstenaarFormulier;
