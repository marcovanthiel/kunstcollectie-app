import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Select, 
  Button, 
  Grid, 
  GridItem,
  Flex,
  Stack,
  useToast,
  Checkbox,
  CheckboxGroup,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ButtonGroup,
  Icon
} from '@chakra-ui/react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileCode } from 'react-icons/fa';

const Rapportages = () => {
  const toast = useToast();
  
  // State voor rapportage type
  const [rapportageType, setRapportageType] = useState('overzicht');
  const [exportFormaat, setExportFormaat] = useState('pdf');
  const [selectedFields, setSelectedFields] = useState([
    'titel', 'kunstenaar', 'type', 'locatie', 'waarde'
  ]);
  const [filterOptions, setFilterOptions] = useState({
    kunstenaar_id: '',
    locatie_id: '',
    type_id: '',
    min_waarde: '',
    max_waarde: ''
  });
  
  // Placeholder data - in een echte applicatie zou dit van de API komen
  const kunstenaars = [
    { id: 1, naam: 'Anna de Vries' },
    { id: 2, naam: 'Pieter Jansen' },
    { id: 3, naam: 'Marieke Bakker' },
    { id: 4, naam: 'Thomas Visser' }
  ];
  
  const locaties = [
    { id: 1, naam: 'Hoofdkantoor' },
    { id: 2, naam: 'Bijkantoor Rotterdam' },
    { id: 3, naam: 'Galerie Noord' },
    { id: 4, naam: 'Externe opslag' }
  ];
  
  const kunstwerkTypes = [
    { id: 1, naam: 'Schilderij' },
    { id: 2, naam: 'Sculptuur' },
    { id: 3, naam: 'Fotografie' },
    { id: 4, naam: 'Tekening' },
    { id: 5, naam: 'Grafiek' }
  ];
  
  // Voorbeeld rapportage data
  const rapportageData = [
    {
      id: 1,
      titel: 'Zonsondergang aan zee',
      kunstenaar: 'Anna de Vries',
      type: 'Schilderij',
      locatie: 'Hoofdkantoor',
      waarde: 3000,
      aankoopprijs: 2500,
      aankoopdatum: '2021-05-15'
    },
    {
      id: 2,
      titel: 'Abstracte compositie #5',
      kunstenaar: 'Pieter Jansen',
      type: 'Schilderij',
      locatie: 'Bijkantoor Rotterdam',
      waarde: 4000,
      aankoopprijs: 3500,
      aankoopdatum: '2022-02-10'
    },
    {
      id: 3,
      titel: 'Stadsgezicht Amsterdam',
      kunstenaar: 'Marieke Bakker',
      type: 'Fotografie',
      locatie: 'Hoofdkantoor',
      waarde: 1800,
      aankoopprijs: 1500,
      aankoopdatum: '2020-11-22'
    },
    {
      id: 4,
      titel: 'Bronzen sculptuur',
      kunstenaar: 'Thomas Visser',
      type: 'Sculptuur',
      locatie: 'Galerie Noord',
      waarde: 5000,
      aankoopprijs: 4200,
      aankoopdatum: '2023-01-05'
    }
  ];
  
  const handleRapportageTypeChange = (e) => {
    setRapportageType(e.target.value);
  };
  
  const handleExportFormaatChange = (e) => {
    setExportFormaat(e.target.value);
  };
  
  const handleFieldsChange = (values) => {
    setSelectedFields(values);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
  };
  
  const handleGenerateRapportage = () => {
    console.log('Genereer rapportage:', {
      type: rapportageType,
      formaat: exportFormaat,
      velden: selectedFields,
      filters: filterOptions
    });
    
    // Hier zou de API call komen om de rapportage te genereren
    
    toast({
      title: 'Rapportage gegenereerd',
      description: `De ${rapportageType} rapportage is succesvol gegenereerd in ${exportFormaat.toUpperCase()} formaat.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  
  const getExportIcon = (format) => {
    switch (format) {
      case 'pdf':
        return FaFilePdf;
      case 'docx':
        return FaFileWord;
      case 'xlsx':
        return FaFileExcel;
      case 'xml':
        return FaFileCode;
      default:
        return FaFilePdf;
    }
  };
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Rapportages</Heading>
      
      <Stack spacing={6}>
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Rapportage instellingen</Heading>
          
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormControl isRequired>
                <FormLabel>Type rapportage</FormLabel>
                <Select 
                  value={rapportageType} 
                  onChange={handleRapportageTypeChange}
                >
                  <option value="overzicht">Overzichtsrapportage kunstwerken</option>
                  <option value="waardering">Waarderingsrapportage</option>
                  <option value="kunstenaar">Rapportage per kunstenaar</option>
                  <option value="locatie">Rapportage per locatie</option>
                </Select>
              </FormControl>
            </GridItem>
            
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <FormControl isRequired>
                <FormLabel>Export formaat</FormLabel>
                <Select 
                  value={exportFormaat} 
                  onChange={handleExportFormaatChange}
                >
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX (Word)</option>
                  <option value="xlsx">XLSX (Excel)</option>
                  <option value="xml">XML</option>
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        
        {rapportageType === 'kunstenaar' && (
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Kunstenaar selecteren</Heading>
            
            <FormControl isRequired>
              <FormLabel>Kunstenaar</FormLabel>
              <Select 
                name="kunstenaar_id" 
                value={filterOptions.kunstenaar_id} 
                onChange={handleFilterChange}
                placeholder="Selecteer kunstenaar"
              >
                {kunstenaars.map(kunstenaar => (
                  <option key={kunstenaar.id} value={kunstenaar.id}>{kunstenaar.naam}</option>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        {rapportageType === 'locatie' && (
          <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
            <Heading size="md" mb={4}>Locatie selecteren</Heading>
            
            <FormControl isRequired>
              <FormLabel>Locatie</FormLabel>
              <Select 
                name="locatie_id" 
                value={filterOptions.locatie_id} 
                onChange={handleFilterChange}
                placeholder="Selecteer locatie"
              >
                {locaties.map(locatie => (
                  <option key={locatie.id} value={locatie.id}>{locatie.naam}</option>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Velden selecteren</Heading>
          
          <CheckboxGroup colorScheme="blue" value={selectedFields} onChange={handleFieldsChange}>
            <Grid templateColumns="repeat(12, 1fr)" gap={4}>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="titel">Titel</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="kunstenaar">Kunstenaar</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="type">Type</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="locatie">Locatie</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="afmetingen">Afmetingen</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="productiedatum">Productiedatum</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="aankoopdatum">Aankoopdatum</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="aankoopprijs">Aankoopprijs</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="waarde">Huidige waarde</Checkbox>
              </GridItem>
              <GridItem colSpan={{ base: 6, md: 3 }}>
                <Checkbox value="beschrijving">Beschrijving</Checkbox>
              </GridItem>
            </Grid>
          </CheckboxGroup>
        </Box>
        
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Filters</Heading>
          
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            {rapportageType !== 'kunstenaar' && (
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Kunstenaar</FormLabel>
                  <Select 
                    name="kunstenaar_id" 
                    value={filterOptions.kunstenaar_id} 
                    onChange={handleFilterChange}
                    placeholder="Alle kunstenaars"
                  >
                    {kunstenaars.map(kunstenaar => (
                      <option key={kunstenaar.id} value={kunstenaar.id}>{kunstenaar.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            )}
            
            {rapportageType !== 'locatie' && (
              <GridItem colSpan={{ base: 12, md: 4 }}>
                <FormControl>
                  <FormLabel>Locatie</FormLabel>
                  <Select 
                    name="locatie_id" 
                    value={filterOptions.locatie_id} 
                    onChange={handleFilterChange}
                    placeholder="Alle locaties"
                  >
                    {locaties.map(locatie => (
                      <option key={locatie.id} value={locatie.id}>{locatie.naam}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            )}
            
            <GridItem colSpan={{ base: 12, md: 4 }}>
              <FormControl>
                <FormLabel>Type kunstwerk</FormLabel>
                <Select 
                  name="type_id" 
                  value={filterOptions.type_id} 
                  onChange={handleFilterChange}
                  placeholder="Alle types"
                >
                  {kunstwerkTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.naam}</option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        
        <Box p={5} borderWidth="1px" borderRadius="lg" bg="white">
          <Heading size="md" mb={4}>Voorbeeld</Heading>
          
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  {selectedFields.includes('titel') && <Th>Titel</Th>}
                  {selectedFields.includes('kunstenaar') && <Th>Kunstenaar</Th>}
                  {selectedFields.includes('type') && <Th>Type</Th>}
                  {selectedFields.includes('locatie') && <Th>Locatie</Th>}
                  {selectedFields.includes('aankoopdatum') && <Th>Aankoopdatum</Th>}
                  {selectedFields.includes('aankoopprijs') && <Th>Aankoopprijs</Th>}
                  {selectedFields.includes('waarde') && <Th>Waarde</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {rapportageData.map(item => (
                  <Tr key={item.id}>
                    {selectedFields.includes('titel') && <Td>{item.titel}</Td>}
                    {selectedFields.includes('kunstenaar') && <Td>{item.kunstenaar}</Td>}
                    {selectedFields.includes('type') && <Td>{item.type}</Td>}
                    {selectedFields.includes('locatie') && <Td>{item.locatie}</Td>}
                    {selectedFields.includes('aankoopdatum') && <Td>{item.aankoopdatum}</Td>}
                    {selectedFields.includes('aankoopprijs') && <Td>€ {item.aankoopprijs}</Td>}
                    {selectedFields.includes('waarde') && <Td>€ {item.waarde}</Td>}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        
        <Flex justifyContent="flex-end" gap={4}>
          <ButtonGroup>
            <Button 
              leftIcon={<Icon as={getExportIcon(exportFormaat)} />} 
              colorScheme="blue" 
              onClick={handleGenerateRapportage}
            >
              Rapportage genereren
            </Button>
          </ButtonGroup>
        </Flex>
      </Stack>
    </Box>
  );
};

export default Rapportages;
