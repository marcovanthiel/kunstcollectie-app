// Dashboard component voor de applicatie
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Divider,
  Button,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaPaintBrush, FaUser, FaMapMarkerAlt, FaChartBar, FaEye } from 'react-icons/fa';
import { kunstwerkenService, kunstenaarsService, locatiesService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    aantalKunstwerken: 0,
    aantalKunstenaars: 0,
    aantalLocaties: 0,
    totaleWaarde: 0
  });
  const [recenteKunstwerken, setRecenteKunstwerken] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Haal statistieken op
        const [kunstwerkenRes, kunstenaarsRes, locatiesRes] = await Promise.all([
          kunstwerkenService.getAll({ limit: 1 }),
          kunstenaarsService.getAll({ limit: 1 }),
          locatiesService.getAll({ limit: 1 })
        ]);
        
        // Haal recente kunstwerken op
        const recenteKunstwerkenRes = await kunstwerkenService.getAll({ 
          limit: 5,
          sort: 'created_at:desc'
        });
        
        setStats({
          aantalKunstwerken: kunstwerkenRes.data.pagination.total,
          aantalKunstenaars: kunstenaarsRes.data.pagination.total,
          aantalLocaties: locatiesRes.data.pagination.total,
          totaleWaarde: kunstwerkenRes.data.data.reduce((sum, item) => sum + (item.huidige_marktprijs || 0), 0)
        });
        
        setRecenteKunstwerken(recenteKunstwerkenRes.data.data);
      } catch (error) {
        console.error('Fout bij ophalen dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Formateer waarde als geldbedrag
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Dashboard</Heading>
        <Text>Welkom, {user?.naam || 'Gebruiker'}</Text>
      </Flex>
      
      {/* Statistieken */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          title="Kunstwerken" 
          value={stats.aantalKunstwerken} 
          icon={FaPaintBrush} 
          iconColor="blue.500"
          isLoading={isLoading}
          linkTo="/kunstwerken"
        />
        
        <StatCard 
          title="Kunstenaars" 
          value={stats.aantalKunstenaars} 
          icon={FaUser} 
          iconColor="purple.500"
          isLoading={isLoading}
          linkTo="/kunstenaars"
        />
        
        <StatCard 
          title="Locaties" 
          value={stats.aantalLocaties} 
          icon={FaMapMarkerAlt} 
          iconColor="green.500"
          isLoading={isLoading}
          linkTo="/locaties"
        />
        
        <StatCard 
          title="Totale waarde" 
          value={formatCurrency(stats.totaleWaarde)} 
          icon={FaChartBar} 
          iconColor="orange.500"
          isLoading={isLoading}
          linkTo="/rapportages"
        />
      </SimpleGrid>
      
      {/* Recente kunstwerken */}
      <Box 
        bg={bgColor} 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        mb={8}
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md">Recente kunstwerken</Heading>
          <Button 
            as={RouterLink} 
            to="/kunstwerken" 
            size="sm" 
            colorScheme="blue" 
            variant="outline"
          >
            Alle kunstwerken
          </Button>
        </Flex>
        
        {isLoading ? (
          <Text>Laden...</Text>
        ) : recenteKunstwerken.length === 0 ? (
          <Text>Geen kunstwerken gevonden</Text>
        ) : (
          recenteKunstwerken.map((kunstwerk, index) => (
            <React.Fragment key={kunstwerk.id}>
              <Flex py={3} justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold">{kunstwerk.titel}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {kunstwerk.kunstenaar?.naam || 'Onbekende kunstenaar'} • 
                    {kunstwerk.kunstwerkType?.naam || 'Onbekend type'}
                  </Text>
                </Box>
                <Flex align="center">
                  <Text mr={4} fontWeight="medium">
                    {formatCurrency(kunstwerk.huidige_marktprijs || 0)}
                  </Text>
                  <Link as={RouterLink} to={`/kunstwerken/${kunstwerk.id}`}>
                    <Icon as={FaEye} />
                  </Link>
                </Flex>
              </Flex>
              {index < recenteKunstwerken.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </Box>
      
      {/* Snelle links */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <QuickLinkCard 
          title="Nieuw kunstwerk" 
          description="Voeg een nieuw kunstwerk toe aan de collectie"
          icon={FaPaintBrush}
          linkTo="/kunstwerken/nieuw"
        />
        
        <QuickLinkCard 
          title="Nieuwe kunstenaar" 
          description="Registreer een nieuwe kunstenaar"
          icon={FaUser}
          linkTo="/kunstenaars/nieuw"
        />
        
        <QuickLinkCard 
          title="Rapportages" 
          description="Genereer rapportages en exporteer gegevens"
          icon={FaChartBar}
          linkTo="/rapportages"
        />
      </SimpleGrid>
    </Box>
  );
};

// Statistiek kaart component
const StatCard = ({ title, value, icon, iconColor, isLoading, linkTo }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Link 
      as={RouterLink} 
      to={linkTo} 
      _hover={{ textDecoration: 'none' }}
    >
      <Box 
        bg={bgColor} 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      >
        <Flex justify="space-between">
          <Box>
            <Stat>
              <StatLabel fontSize="md">{title}</StatLabel>
              <StatNumber fontSize="2xl">
                {isLoading ? '...' : value}
              </StatNumber>
              <StatHelpText>Bekijk details</StatHelpText>
            </Stat>
          </Box>
          <Flex
            w="60px"
            h="60px"
            align="center"
            justify="center"
            rounded="full"
            bg={`${iconColor}10`}
          >
            <Icon as={icon} w="24px" h="24px" color={iconColor} />
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

// Snelle link kaart component
const QuickLinkCard = ({ title, description, icon, linkTo }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Link 
      as={RouterLink} 
      to={linkTo} 
      _hover={{ textDecoration: 'none' }}
    >
      <Box 
        bg={bgColor} 
        p={5} 
        borderRadius="lg" 
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
      >
        <Flex direction="column" align="center" textAlign="center">
          <Icon as={icon} w="40px" h="40px" color="blue.500" mb={3} />
          <Heading size="md" mb={2}>{title}</Heading>
          <Text color="gray.600">{description}</Text>
        </Flex>
      </Box>
    </Link>
  );
};

export default Dashboard;
