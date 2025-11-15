import { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Star, Edit2, Save, MapPin, MessageCircle, Users } from 'lucide-react';
import Profile from './Profile';
import UsersList from './UsersList';
import Chat from './Chat';
import { User, Message, getAllUsers, getConversation, sendMessage } from '../lib/supabase';

export default function ProfilePage() {
  const [userData, setUserData] = useState<(User & { id: string }) | null>(null);
  const [allUsers, setAllUsers] = useState<(User & { id: string })[]>([]);
  const [selectedUser, setSelectedUser] = useState<(User & { id: string }) | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'users'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      loadUsers();
    } else {
      window.location.href = '/';
    }
  }, []);

  const loadUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users as (User & { id: string })[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handlePhotoUpload = (file: File) => {
    const photoUrl = URL.createObjectURL(file);
    if (userData) {
      const updatedUser = { ...userData, profile_photo_url: photoUrl };
      setUserData(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const handleBioUpdate = (bio: string) => {
    if (userData) {
      const updatedUser = { ...userData, bio };
      setUserData(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C8102E] to-[#D4AF37]">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-gradient-to-r from-[#C8102E] to-[#D4AF37] shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Single Damm</h1>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="flex border-b border-[#E5E5E5]">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-bold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-[#C8102E] to-[#D4AF37] text-white'
                    : 'text-[#666666] hover:bg-[#F5F5F5]'
                }`}
              >
                <Star className="w-5 h-5" />
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-6 py-4 font-bold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-[#C8102E] to-[#D4AF37] text-white'
                    : 'text-[#666666] hover:bg-[#F5F5F5]'
                }`}
              >
                <Users className="w-5 h-5" />
                Conectar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-[#333333]">Tu Perfil</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.location.href = '/#mapa'}
                      className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C8A028] transition-colors font-medium"
                    >
                      <MapPin className="w-4 h-4" />
                      Ver Mapa
                    </button>
                  </div>
                </div>
                <Profile
                  userData={userData}
                  onPhotoUpload={handlePhotoUpload}
                  onBioUpdate={handleBioUpdate}
                  isEditable={true}
                />

                <div className="bg-gradient-to-br from-[#FFF5F5] to-[#FFFEF5] rounded-2xl p-6 border-2 border-[#FFE5E5]">
                  <h3 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
                    Progreso de Niveles
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#666666]">Nivel actual:</span>
                      <span className="font-bold text-[#C8102E]">{userData.level}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#666666]">Estrellas:</span>
                      <span className="font-bold text-[#D4AF37]">{userData.stars}</span>
                    </div>
                    <div className="w-full bg-[#E5E5E5] rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C8102E] to-[#D4AF37] transition-all duration-500"
                        style={{
                          width: `${Math.min((userData.stars / 31) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-[#999999] text-center">
                      {userData.stars < 11 && `${11 - userData.stars} estrellas para Plata`}
                      {userData.stars >= 11 && userData.stars < 31 && `${31 - userData.stars} estrellas para Oro`}
                      {userData.stars >= 31 && '¡Nivel máximo alcanzado!'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-[#333333] mb-2">Conecta con otros</h2>
                  <p className="text-[#666666]">Conoce gente con buen rollo y comparte experiencias</p>
                </div>
                <UsersList
                  users={allUsers}
                  currentUserId={userData.id}
                  onSelectUser={handleSelectUser}
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
