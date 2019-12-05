import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import PuzzleListItem from './PuzzleListItem';
import { observer } from 'mobx-react';
import { Div, Paper, SubTitle1 } from 'UI/StyledComponents/StyledComponents'

export default observer((props) => {


  return (

    <Div>
      <SubTitle1>
        {props.title}
      </SubTitle1>
      <Paper>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader">
          {props.puzzles.map((item, index) => (
            [<PuzzleListItem key={item.id} puzzle={item} />,
              index < props.puzzles.length - 1 && <Divider key={index} component="li" />]
          ))}
        </List>
      </Paper>
    </Div>
  )
})