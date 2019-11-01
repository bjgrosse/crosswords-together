
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

const MenuItems = function () {

    let lists = [];

    function addList(names, icons, routes) {
        lists.push(names.map((name, index) => {
            return { text: name, icon: icons[index], route: routes[index] }
        }))
    }

    addList(['Add a new puzzle...', 'My Puzzles', 'Settings'],
        [() => <AddIcon />, () => <FolderIcon />, () => <SettingsIcon />],
        ['/add-puzzle', '/puzzles', '/settings']);


    addList(['Log out'],
        [() => <LogoutIcon />],
        ['/logout']);

    return lists;
}

export default MenuItems();