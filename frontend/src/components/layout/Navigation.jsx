// Hoofdnavigatie component met integratie van authenticatie
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link as={RouterLink} to="/">
            <Image
              src="/logo.png"
              alt="Kunstcollectie Logo"
              h="40px"
              fallbackSrc="https://via.placeholder.com/120x40?text=Kunstcollectie"
            />
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Flex align="center">
                  <Avatar
                    size={'sm'}
                    name={user?.naam || 'Gebruiker'}
                    bg="blue.500"
                    color="white"
                    mr={2}
                  />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.naam || 'Gebruiker'}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FaUser />}>Mijn profiel</MenuItem>
                {isAdmin && (
                  <MenuItem 
                    icon={<FaCog />} 
                    as={RouterLink} 
                    to="/admin"
                  >
                    Beheer
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem 
                  icon={<FaSignOutAlt />} 
                  onClick={handleLogout}
                >
                  Uitloggen
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.500'}
              _hover={{
                bg: 'blue.600',
              }}
            >
              Inloggen
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ isAuthenticated, isAdmin }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('blue.600', 'blue.300');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  // Alleen toon navigatie-items als de gebruiker is ingelogd
  if (!isAuthenticated) return null;

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => {
        // Verberg admin items voor niet-admins
        if (navItem.adminOnly && !isAdmin) return null;
        
        return (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  as={RouterLink}
                  to={navItem.href ?? '#'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                  {navItem.children && (
                    <Icon
                      as={ChevronDownIcon}
                      transition={'all .25s ease-in-out'}
                      w={6}
                      h={6}
                    />
                  )}
                </Link>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      as={RouterLink}
      to={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('blue.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'blue.500' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'blue.500'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ isAuthenticated, isAdmin }) => {
  // Alleen toon navigatie-items als de gebruiker is ingelogd
  if (!isAuthenticated) return null;

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => {
        // Verberg admin items voor niet-admins
        if (navItem.adminOnly && !isAdmin) return null;
        
        return (
          <MobileNavItem key={navItem.label} {...navItem} />
        );
      })}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} as={RouterLink} to={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Kunstwerken',
    href: '/kunstwerken',
    children: [
      {
        label: 'Alle kunstwerken',
        subLabel: 'Bekijk alle kunstwerken in de collectie',
        href: '/kunstwerken',
      },
      {
        label: 'Nieuw kunstwerk',
        subLabel: 'Voeg een nieuw kunstwerk toe',
        href: '/kunstwerken/nieuw',
      },
    ],
  },
  {
    label: 'Kunstenaars',
    href: '/kunstenaars',
    children: [
      {
        label: 'Alle kunstenaars',
        subLabel: 'Bekijk alle kunstenaars',
        href: '/kunstenaars',
      },
      {
        label: 'Nieuwe kunstenaar',
        subLabel: 'Voeg een nieuwe kunstenaar toe',
        href: '/kunstenaars/nieuw',
      },
    ],
  },
  {
    label: 'Locaties',
    href: '/locaties',
    children: [
      {
        label: 'Alle locaties',
        subLabel: 'Bekijk alle locaties',
        href: '/locaties',
      },
      {
        label: 'Nieuwe locatie',
        subLabel: 'Voeg een nieuwe locatie toe',
        href: '/locaties/nieuw',
      },
    ],
  },
  {
    label: 'Rapportages',
    href: '/rapportages',
  },
  {
    label: 'Beheer',
    href: '/admin',
    adminOnly: true,
    children: [
      {
        label: 'Gebruikers',
        subLabel: 'Beheer gebruikersaccounts',
        href: '/admin/gebruikers',
      },
      {
        label: 'Import/Export',
        subLabel: 'Importeer of exporteer data',
        href: '/admin/import-export',
      },
      {
        label: 'Back-up',
        subLabel: 'Maak of herstel back-ups',
        href: '/admin/backup',
      },
    ],
  },
];

export default Navigation;
