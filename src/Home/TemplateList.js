import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/OpenInBrowser';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LoadingContainer from '../AppFrame/LoadingContainer';
import CircularProgress from '@material-ui/core/CircularProgress';
import { observer } from 'mobx-react';
import { Div, Paper, SubTitle1 } from '../StyledComponents/StyledComponents'
import CreateNewTemplate from '../EditTemplate/CreateNewTemplate'


const TemplateListItem = (props) => {


    const history = useHistory();
    function navigateTo(path) {
        history.push(path);
    }



    return (
        <ListItem button alignItems="flex-start" onClick={() => navigateTo(`/start-puzzle/${props.id}`)}>
            <ListItemAvatar >
                <Typography>{props.size}</Typography>
            </ListItemAvatar>
            <ListItemText
                primary={props.title}
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                        >
                            {props.source}
                        </Typography>
                    </React.Fragment>
                }
            />
        </ListItem>
    );
}

export default observer((props) => {

    const [showCreateNew, setShowCreateNew] = useState(false);

    const history = useHistory();
    function navigateTo(path) {
        history.push(path);
    }

    if (showCreateNew) {
        return (
            <CreateNewTemplate handleCancel={() => setShowCreateNew(false)} />
        )
    }

    return (
        <Div>
            <Div flex alignCenter mt={1} mb={.5}>
                <Div grow>
                    <SubTitle1 mt={0} mb={0}>
                        Start a new puzzle
                    </SubTitle1>
                </Div>
                <Button startIcon={<AddIcon />} onClick={() => setShowCreateNew(true)}>Import</Button>
            </Div>
            <Paper>
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader">
                    {props.templates.map((item, index) => (
                        <>
                            <TemplateListItem key={item.id} {...item} />
                            {index < props.templates.length - 1 && <Divider component="li" />}
                        </>
                    ))}
                </List>
            </Paper>
        </Div>

    )
})