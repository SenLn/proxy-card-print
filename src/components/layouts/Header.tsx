import { AppBar, Toolbar, Typography } from '@material-ui/core'
import React from 'react'

const Header = () =>
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">
        プロキシカード印刷
      </Typography>
    </Toolbar>
  </AppBar>

export default Header
