// Gebruikersbeheer component voor admin
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { adminService } from '../../services/api';
import { checkPasswordStrength } from '../../utils/security';

const GebruikersBeheer = () => {
  const [gebruikers, setGebruikers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGebruiker, setSelectedGebruiker] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    naam: '',
    wachtwoord: '',
    rol: 'readonly'
  });
  const [passwordStrength, setPasswordStrength] = useState(null);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  // Haal gebruikers op bij het laden van de component
  useEffect(() => {
    fetchGebruikers();
  }, []);

  // Haal alle gebruikers op
  const fetchGebruikers = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getGebruikers();
      setGebruikers(response.data.data);
    } catch (error) {
      console.error('Fout bij ophalen gebruikers:', error);
      toast({
        title: 'Fout',
        description: 'Er is een fout opgetreden bij het ophalen van de gebruikers.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal voor nieuwe gebruiker
  const handleAddNew = () => {
    setSelectedGebruiker(null);
    setFormData({
      email: '',
      naam: '',
      wachtwoord: '',
      rol: 'readonly'
    });
    setPasswordStrength(null);
    onOpen();
  };

  // Open modal voor bewerken gebruiker
  const handleEdit = (gebruiker) => {
    setSelectedGebruiker(gebruiker);
    setFormData({
      email: gebruiker.email,
      naam: gebruiker.naam,
      wachtwoord: '',
      rol: gebruiker.rol
    });
    setPasswordStrength(null);
    onOpen();
  };

  // Open delete bevestiging
  const handleDeleteClick = (gebruiker) => {
    setSelectedGebruiker(gebruiker);
    onDeleteOpen();
  };

  // Verwijder gebruiker
  const handleDelete = async () => {
    try {
      await adminService.deleteGebruiker(selectedGebruiker.id);
      
      toast({
        title: 'Succes',
        description: `Gebruiker ${selectedGebruiker.naam} is verwijderd.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Ververs de lijst
      fetchGebruikers();
    } catch (error) {
      console.error('Fout bij verwijderen gebruiker:', error);
      toast({
        title: 'Fout',
        description: error.response?.data?.message || 'Er is een fout opgetreden bij het verwijderen van de gebruiker.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
    }
  };

  // Formulier input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Controleer wachtwoordsterkte
    if (name === 'wachtwoord' && value) {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Formulier submit handler
  const handleSubmit = async () => {
    try {
      // Valideer formulier
      if (!formData.email || !formData.naam || (!selectedGebruiker && !formData.wachtwoord)) {
        toast({
          title: 'Fout',
          description: 'Vul alle verplichte velden in.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // Valideer wachtwoordsterkte voor nieuwe gebruikers of bij wachtwoordwijziging
      if (formData.wachtwoord && (!passwordStrength || !passwordStrength.valid)) {
        toast({
          title: 'Fout',
          description: passwordStrength?.message || 'Wachtwoord voldoet niet aan de vereisten.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      if (selectedGebruiker) {
        // Update bestaande gebruiker
        const updateData = {
          email: formData.email,
          naam: formData.naam,
          rol: formData.rol
        };
        
        // Voeg wachtwoord toe als het is ingevuld
        if (formData.wachtwoord) {
          updateData.wachtwoord = formData.wachtwoord;
        }
        
        await adminService.updateGebruiker(selectedGebruiker.id, updateData);
        
        toast({
          title: 'Succes',
          description: `Gebruiker ${formData.naam} is bijgewerkt.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Maak nieuwe gebruiker aan
        await adminService.createGebruiker(formData);
        
        toast({
          title: 'Succes',
          description: `Gebruiker ${formData.naam} is aangemaakt.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      // Sluit modal en ververs de lijst
      onClose();
      fetchGebruikers();
    } catch (error) {
      console.error('Fout bij opslaan gebruiker:', error);
      toast({
        title: 'Fout',
        description: error.response?.data?.message || 'Er is een fout opgetreden bij het opslaan van de gebruiker.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Gebruikersbeheer</Heading>
        <Button 
          leftIcon={<FaUserPlus />} 
          colorScheme="blue" 
          onClick={handleAddNew}
        >
          Nieuwe gebruiker
        </Button>
      </Flex>
      
      <Box 
        bg="white" 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
        overflowX="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Naam</Th>
              <Th>Email</Th>
              <Th>Rol</Th>
              <Th>Laatst ingelogd</Th>
              <Th width="100px">Acties</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5} textAlign="center">Laden...</Td>
              </Tr>
            ) : gebruikers.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center">Geen gebruikers gevonden</Td>
              </Tr>
            ) : (
              gebruikers.map((gebruiker) => (
                <Tr key={gebruiker.id}>
                  <Td>{gebruiker.naam}</Td>
                  <Td>{gebruiker.email}</Td>
                  <Td>
                    <Badge 
                      colorScheme={gebruiker.rol === 'admin' ? 'purple' : 'green'}
                    >
                      {gebruiker.rol}
                    </Badge>
                  </Td>
                  <Td>
                    {gebruiker.laatst_ingelogd 
                      ? new Date(gebruiker.laatst_ingelogd).toLocaleString('nl-NL') 
                      : 'Nooit'}
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Bewerk gebruiker"
                        icon={<FaEdit />}
                        size="sm"
                        onClick={() => handleEdit(gebruiker)}
                      />
                      <IconButton
                        aria-label="Verwijder gebruiker"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(gebruiker)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      
      {/* Modal voor toevoegen/bewerken gebruiker */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedGebruiker ? 'Gebruiker bewerken' : 'Nieuwe gebruiker'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>Naam</FormLabel>
              <Input
                name="naam"
                value={formData.naam}
                onChange={handleInputChange}
              />
            </FormControl>
            
            <FormControl mb={4} isRequired={!selectedGebruiker}>
              <FormLabel>
                {selectedGebruiker 
                  ? 'Wachtwoord (laat leeg om ongewijzigd te laten)' 
                  : 'Wachtwoord'}
              </FormLabel>
              <Input
                name="wachtwoord"
                type="password"
                value={formData.wachtwoord}
                onChange={handleInputChange}
              />
              {passwordStrength && (
                <Text 
                  mt={1} 
                  fontSize="sm" 
                  color={passwordStrength.valid ? 'green.500' : 'red.500'}
                >
                  {passwordStrength.message}
                </Text>
              )}
              <Text fontSize="xs" mt={1} color="gray.500">
                Wachtwoord moet minimaal 8 tekens bevatten, met hoofdletters, 
                kleine letters, cijfers en speciale tekens.
              </Text>
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>Rol</FormLabel>
              <Select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
              >
                <option value="admin">Admin</option>
                <option value="readonly">Alleen lezen</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuleren
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Opslaan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Alert dialog voor verwijderen */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Gebruiker verwijderen
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je gebruiker "{selectedGebruiker?.naam}" wilt verwijderen?
              Deze actie kan niet ongedaan worden gemaakt.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Annuleren
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Verwijderen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default GebruikersBeheer;
