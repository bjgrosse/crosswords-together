
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

const MenuItems = function () {

    let lists = [];

    function addList(names, icons, routes) {
        lists.push(names.map((name, index) => {
            return { text: name, icon: icons[index], route: routes[index] }
        }))
    }

    addList(['Home', 'Settings'],
        [() => <HomeIcon />, () => <SettingsIcon />],
        ['/', '/settings']);


    addList(['Log out'],
        [() => <LogoutIcon />],
        ['/logout']);

    return lists;
}

export default MenuItems();