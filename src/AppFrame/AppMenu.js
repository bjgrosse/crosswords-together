import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});


export default function (props) {
    const classes = useStyles();

    const history = useHistory();
    function navigateTo(path) {
        history.push(path);
    }

    let menuItems = [];

    console.log(props.menuItems);
    for (const chunk of props.menuItems) {
        if (menuItems.length > 0) {
            menuItems.push(<Divider key={menuItems.length} />)
        }
        menuItems.push(
            <List key={menuItems.length}>
                {chunk.map((item, index) => (
                    <ListItem button key={item.text} onClick={() => navigateTo(item.route)}>
                        <ListItemIcon>{item.icon()}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>)
    }

    const sideList =

        <div
            className={classes.list}
            role="presentation"
            onClick={props.closeMenu}
            onKeyDown={props.closeMenu}>

            {menuItems}

        </div >


    return (
        <div>
            <Drawer anchor="left" open={props.isOpen} onClose={props.closeMenu}>
                {sideList}
            </Drawer>
        </div >
    );
}