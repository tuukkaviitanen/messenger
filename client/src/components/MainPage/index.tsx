import { Message } from '../../utils/types';
import Chat from './Chat';
import NavBar from './NavBar';

const MainPage = () => {
  const messages: Message[] = [{ message: 'hello', sender: 'tuukka' }, { message: 'how are you?', sender: 'tuukka' }];

  return (
    <>
      <NavBar />

      <Chat messages={messages} />
    </>
  );
};

export default MainPage;
