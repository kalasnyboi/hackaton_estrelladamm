import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Map from './components/Map';
import Messaging from './components/Messaging';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Profile from './components/Profile';
import UsersList from './components/UsersList';
import Chat from './components/Chat';
import { User, Message, getAllUsers, getConversation, sendMessage } from './lib/supabase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<(User & { id: string }) | null>(null);
  const [allUsers, setAllUsers] = useState<(User & { id: string })[]>([]);
  const [selectedUser, setSelectedUser] = useState<(User & { id: string }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', smoothScroll);
    return () => document.removeEventListener('click', smoothScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadUsers();
    }
  }, [isLoggedIn]);

  const loadUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users as (User & { id: string })[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleRegistration = (data: { name: string; age: number; gender: string }) => {
    const newUser: User & { id: string } = {
      id: `user-${Date.now()}`,
      name: data.name,
      age: data.age,
      gender: data.gender,
      stars: 0,
      level: 'Bronce',
      visible_on_map: false,
      created_at: new Date().toISOString()
    };
    setUserData(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoggedIn(true);
    window.location.href = '/profile';
  };

  const handleAddStar = () => {
    if (!userData) return;
    const newStars = userData.stars + 1;
    let newLevel = 'Bronce';
    if (newStars >= 31) newLevel = 'Oro';
    else if (newStars >= 11) newLevel = 'Plata';
    setUserData({ ...userData, stars: newStars, level: newLevel });
  };

  const handlePhotoUpload = (file: File) => {
    const photoUrl = URL.createObjectURL(file);
    if (userData) {
      setUserData({ ...userData, profile_photo_url: photoUrl });
    }
  };

  const handleBioUpdate = (bio: string) => {
    if (userData) {
      setUserData({ ...userData, bio });
    }
  };

  const handleSelectUser = async (user: User & { id: string }) => {
    if (!userData) return;
    setSelectedUser(user);
    try {
      const conversation = await getConversation(userData.id, user.id);
      setMessages(conversation);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!userData || !selectedUser) return;
    try {
      await sendMessage(userData.id, selectedUser.id, content);
      const updatedConversation = await getConversation(userData.id, selectedUser.id);
      setMessages(updatedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isLoggedIn={isLoggedIn} />
      <Hero />
      <HowItWorks />
      <Registration onRegister={handleRegistration} isLoggedIn={isLoggedIn} />
      <Map />
      <Messaging />
      <FAQ />
      <Footer />

      {selectedUser && userData && (
        <Chat
          currentUser={userData}
          otherUser={selectedUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

export default App;
