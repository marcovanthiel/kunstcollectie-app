import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Select, 
  NumberInput, 
  NumberInputField, 
  Checkbox, 
  Button, 
  Grid, 
  GridItem,
  Flex,
  Stack,
  Divider,
  useToast
} from '@chakra-ui/react';

const KunstwerkFormulier = ({ isEditing = false }) => {
  const toast = useToast();
  
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const kunstenaars = [
    { id: 1, naam: 'Anna de Vries' },
    { id: 2, naam: 'Pieter Jansen' },
    { id: 3, naam: 'Marieke Bakker' },
    { id: 4, naam: 'Thomas Visser' }
  ];
  
  const kunstwerkTypes = [
    { id: 1, naam: 'Schilderij' },
    { id: 2, naam: 'Sculptuur' },
    { id: 3, naam: 'Fotografie' },
    { id: 4, naam: 'Tekening' },
    { id: 5, naam: 'Grafiek' }
  ];
  
  const locaties = [
    { id: 1, naam: 'Hoofdkantoor' },
    { id: 2, naam: 'Bijkantoor' },
    { id: 3, naam: 'Externe locatie' }
  ];
  
  const leveranciers = [
    { id: 1, naam: 'Galerie Amsterdam' },
    { id: 2, naam: 'Kunsthandel Rotterdam' },
    { id: 3, naam: 'Veilinghuis Utrecht' }
  ];
  
  // State voor formulier
  const [formData, setFormData] = useState({
    titel: '',
    kunstenaar_id: '',
    type_id: '',
    hoogte: '',
    breedte: '',
    diepte: '',
    gewicht: '',
    productiedatum: '',
    is_schatting_datum: false,
    is_editie: false,
    editie_beschrijving: '',
    is_gesigneerd: false,
    handtekening_locatie: '',
    beschrijving: '',
    locatie_id: '',
    aankoopdatum: '',
    aankoopprijs: '',
    leverancier_id: '',
    huidige_marktprijs: '',
    verzekerde_waarde: '',
    status: 'in bezit'
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNumberChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    
    // Hier zou de API call komen om het kunstwerk op te slaan
    
    toast({
      title: isEditing ? 'Kunstwerk bijgewerkt' : 'Kunstwerk toegevoegd',
      description: `${formData.titel} is succesvol ${isEditing ? 'bijgewerkt' : 'toegevoegd'}.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>{isEditing ? 'Kunstwerk bewerken' : 'Nieuw kunstwerk toevoegen'}</Heading>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={6}>
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Basisinformatie</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 8 }}>
                <FormControl isRequired>
                  <FormLabel>Titel</FormLabel>
                  <Input 
                    name="titel" 
                    value={formData.titel} 
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
                    {kunstwerkTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl isRequired>
                  <FormLabel>Kunstenaar</FormLabel>
                  <Select 
                    name="kunstenaar_id" 
                    value={formData.kunstenaar_id} 
                    onChange={handleChange}
                    placeholder="Selecteer kunstenaar"
                  >
                    {kunstenaars.map(kunstenaar => (
                      <option key={kunstenaar.id} value={kunstenaar.id}>{kunstenaar.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>Productiedatum</FormLabel>
                  <Input 
                    name="productiedatum" 
                    type="date" 
                    value={formData.productiedatum} 
                    onChange={handleChange} 
                  />
                  <Checkbox 
                    name="is_schatting_datum" 
                    isChecked={formData.is_schatting_datum} 
                    onChange={handleChange}
                    mt={2}
                  >
                    Geschatte datum
                  </Checkbox>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={12}>
                <FormControl>
                  <FormLabel>Beschrijving</FormLabel>
                  <Textarea 
                    name="beschrijving" 
                    value={formData.beschrijving} 
                    onChange={handleChange} 
                    rows={4}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Afmetingen</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Hoogte (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="hoogte" 
                      value={formData.hoogte} 
                      onChange={(e) => handleNumberChange('hoogte', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Breedte (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="breedte" 
                      value={formData.breedte} 
                      onChange={(e) => handleNumberChange('breedte', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Diepte (cm)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="diepte" 
                      value={formData.diepte} 
                      onChange={(e) => handleNumberChange('diepte', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <FormControl>
                  <FormLabel>Gewicht (kg)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="gewicht" 
                      value={formData.gewicht} 
                      onChange={(e) => handleNumberChange('gewicht', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Details</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <Checkbox 
                    name="is_editie" 
                    isChecked={formData.is_editie} 
                    onChange={handleChange}
                    mb={2}
                  >
                    Editie
                  </Checkbox>
                  {formData.is_editie && (
                    <Input 
                      name="editie_beschrijving" 
                      value={formData.editie_beschrijving} 
                      onChange={handleChange} 
                      placeholder="Beschrijving van de editie"
                      mt={2}
                    />
                  )}
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <Checkbox 
                    name="is_gesigneerd" 
                    isChecked={formData.is_gesigneerd} 
                    onChange={handleChange}
                    mb={2}
                  >
                    Gesigneerd
                  </Checkbox>
                  {formData.is_gesigneerd && (
                    <Input 
                      name="handtekening_locatie" 
                      value={formData.handtekening_locatie} 
                      onChange={handleChange} 
                      placeholder="Locatie van de handtekening"
                      mt={2}
                    />
                  )}
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Locatie en waardering</Heading>
            
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl isRequired>
                  <FormLabel>Locatie</FormLabel>
                  <Select 
                    name="locatie_id" 
                    value={formData.locatie_id} 
                    onChange={handleChange}
                    placeholder="Selecteer locatie"
                  >
                    {locaties.map(locatie => (
                      <option key={locatie.id} value={locatie.id}>{locatie.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                  >
                    <option value="in bezit">In bezit</option>
                    <option value="verkocht">Verkocht</option>
                    <option value="uitgeleend">Uitgeleend</option>
                  </Select>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Aankoopdatum</FormLabel>
                  <Input 
                    name="aankoopdatum" 
                    type="date" 
                    value={formData.aankoopdatum} 
                    onChange={handleChange} 
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 4 }}>
                <FormControl>
                  <FormLabel>Aankoopprijs (€)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="aankoopprijs" 
                      value={formData.aankoopprijs} 
                      onChange={(e) => handleNumberChange('aankoopprijs', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 4 }}>
                <FormControl>
                  <FormLabel>Leverancier</FormLabel>
                  <Select 
                    name="leverancier_id" 
                    value={formData.leverancier_id} 
                    onChange={handleChange}
                    placeholder="Selecteer leverancier"
                  >
                    {leveranciers.map(leverancier => (
                      <option key={leverancier.id} value={leverancier.id}>{leverancier.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Huidige marktprijs (€)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="huidige_marktprijs" 
                      value={formData.huidige_marktprijs} 
                      onChange={(e) => handleNumberChange('huidige_marktprijs', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={{ base: 6, md: 6 }}>
                <FormControl>
                  <FormLabel>Verzekerde waarde (€)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField 
                      name="verzekerde_waarde" 
                      value={formData.verzekerde_waarde} 
                      onChange={(e) => handleNumberChange('verzekerde_waarde', e.target.value)} 
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Afbeeldingen en bijlagen</Heading>
            
            <Box mb={4} p={4} borderWidth="2px" borderRadius="md" borderStyle="dashed" textAlign="center">
              <Button colorScheme="blue">Afbeeldingen toevoegen</Button>
              <Text mt={2} fontSize="sm" color="gray.500">Sleep afbeeldingen hierheen of klik om te uploaden (max. 15 afbeeldingen)</Text>
            </Box>
            
            <Divider my={4} />
            
            <Box p={4} borderWidth="2px" borderRadius="md" borderStyle="dashed" textAlign="center">
              <Button colorScheme="blue">Bijlagen toevoegen</Button>
              <Text mt={2} fontSize="sm" color="gray.500">Sleep PDF of DOCX bestanden hierheen of klik om te uploaden</Text>
            </Box>
          </Box>
          
          <Flex justifyContent="flex-end" gap={4}>
            <Button variant="outline">Annuleren</Button>
            <Button type="submit" colorScheme="green">
              {isEditing ? 'Wijzigingen opslaan' : 'Kunstwerk toevoegen'}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
};

export default KunstwerkFormulier;
