import { useState, useEffect } from 'react';
import { MapPin, Star, Eye, EyeOff, Navigation, MessageCircle } from 'lucide-react';
import { User } from '../lib/supabase';

interface MapProps {
  users: (User & { id: string })[];
  currentUser?: (User & { id: string }) | null;
  onMessageUser?: (user: User & { id: string }) => void;
}

export default function Map({ users, currentUser, onMessageUser }: MapProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const nearbyUsers = users.filter(u =>
    u.visible_on_map &&
    u.id !== currentUser?.id
  ).map((user, index) => ({
    ...user,
    distance: index === 0 ? '3 calles' : index === 1 ? 'tu barrio' : `${index + 2} calles`,
    lat: 41.3851 + index * 0.002,
    lng: 2.1734 + index * 0.002
  }));

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Oro': return 'text-[#D4AF37]';
      case 'Plata': return 'text-[#C0C0C0]';
      default: return 'text-[#CD7F32]';
    }
  };

  return (
    <section id="mapa" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
            ¿Quién brilla por tu zona?
          </h2>
          <p className="text-xl text-[#666666] mb-6">
            Otros cazadores de estrellas en tu área (solo si quieren ser vistos)
          </p>

          <div className="inline-flex items-center gap-4 bg-[#F5F5F5] rounded-full px-6 py-3">
            <span className="text-sm font-medium text-[#333333]">Aparecer en el mapa</span>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isVisible ? 'bg-[#C8102E]' : 'bg-[#CCCCCC]'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isVisible ? 'translate-x-7' : ''
                }`}
              >
                {isVisible ? (
                  <Eye className="w-3 h-3 text-[#C8102E] absolute top-1 left-1" />
                ) : (
                  <EyeOff className="w-3 h-3 text-[#999999] absolute top-1 left-1" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#F5F5F5] rounded-3xl overflow-hidden shadow-xl h-[500px] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/5 to-[#D4AF37]/5">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <Navigation className="w-12 h-12 text-[#C8102E] fill-[#C8102E] animate-pulse" />
                      <div className="absolute inset-0 animate-ping">
                        <div className="w-12 h-12 border-4 border-[#C8102E] rounded-full opacity-75"></div>
                      </div>
                    </div>
                  </div>

                  {nearbyUsers.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                        selectedUser === user.id ? 'scale-125 z-10' : ''
                      }`}
                      style={{
                        top: `${30 + index * 15}%`,
                        left: `${25 + index * 12}%`
                      }}
                    >
                      <MapPin className={`w-8 h-8 ${getLevelColor(user.level)} fill-current drop-shadow-lg`} />
                      {selectedUser === user.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl p-4 w-56 animate-fade-in">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className={`w-5 h-5 ${getLevelColor(user.level)} fill-current`} />
                            <div className="text-left">
                              <p className="font-bold text-[#333333]">{user.name}, {user.age}</p>
                              <p className="text-xs text-[#666666]">Nivel {user.level}</p>
                            </div>
                          </div>
                          {user.bio && (
                            <p className="text-xs text-[#999999] mb-2">"{user.bio}"</p>
                          )}
                          <p className="text-xs text-[#D4AF37] font-medium mb-3">📍 {user.distance}</p>
                          {onMessageUser && currentUser && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMessageUser(user);
                              }}
                              className="w-full bg-gradient-to-r from-[#C8102E] to-[#D4AF37] text-white text-sm font-bold py-2 px-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Enviar mensaje
                            </button>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-[#666666]">
                  <p className="font-medium">🔒 Ubicación aproximada, solo visible para usuarios verificados</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-[#333333] mb-4">Cerca de ti</h3>
              {nearbyUsers.length === 0 ? (
                <div className="bg-[#F5F5F5] rounded-xl p-6 text-center">
                  <MapPin className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
                  <p className="text-[#666666]">No hay usuarios visibles cerca</p>
                </div>
              ) : (
                nearbyUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`bg-[#F5F5F5] hover:bg-[#FFF5F5] rounded-xl p-4 transition-all ${
                      selectedUser === user.id ? 'ring-2 ring-[#C8102E]' : ''
                    }`}
                  >
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-[#333333]">{user.name}, {user.age}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className={`w-4 h-4 ${getLevelColor(user.level)} fill-current`} />
                            <span className="text-sm text-[#666666]">Nivel {user.level}</span>
                          </div>
                        </div>
                        <MapPin className={`w-5 h-5 ${getLevelColor(user.level)}`} />
                      </div>
                      {user.bio && (
                        <p className="text-sm text-[#999999] mb-2">"{user.bio}"</p>
                      )}
                      <p className="text-xs text-[#D4AF37] font-medium">a {user.distance}</p>
                    </button>
                    {onMessageUser && currentUser && (
                      <button
                        onClick={() => onMessageUser(user)}
                        className="w-full mt-3 bg-gradient-to-r from-[#C8102E] to-[#D4AF37] text-white text-sm font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Enviar mensaje
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
