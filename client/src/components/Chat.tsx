import { Button, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../hooks';
import { removeCurrentUser } from '../reducers/userReducer';

const Chat = () => {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.user.currentUser)

  const handleLogout = () => {
    dispatch(removeCurrentUser())
  }

  return(
    <>
    <Typography>Logged in as {currentUser?.username}</Typography>
    <Button variant='contained' onClick={handleLogout}>Logout</Button>
    </>
  )
}

export default Chat;
