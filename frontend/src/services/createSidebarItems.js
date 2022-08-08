import SideNavDropdown from '../components/navigation/SideNavDropdown';
import {Box} from '@chakra-ui/react';
import {NavLink} from 'react-router-dom';
import SideNavItem from '../components/navigation/SideNavItem';

const createSidebarItems = (links, dropdown, activeBg, activeColor, activeRoute, loc) => {
  return links.map((route) => {
    if (route.children) {
      return (
        <SideNavDropdown key={'side' + route.name} bg={activeBg} color={activeColor}
                         active={loc.pathname.substring(4).includes(route.path.substring(4))} icon={route.icon}
                         label={route.name}>
          {createSidebarItems(route.children, true, activeBg, activeColor, activeRoute, loc)}
        </SideNavDropdown>
      )
    }

    return (
      <Box width={'100%'} key={'side' + route.name}>
        <NavLink to={route.path}>
          <SideNavItem icon={route.icon} active={activeRoute(route.path)} bg={activeBg} color={activeColor}
                       transform={'none'} p='6px' borderRadius={dropdown ? '0' : '7px'}>
            {route.name}
          </SideNavItem>
        </NavLink>
      </Box>
    );
  });
};

export default createSidebarItems;