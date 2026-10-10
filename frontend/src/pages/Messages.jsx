import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Send, User, Search, CheckCheck, Paperclip, Phone, MoreVertical, Compass } from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    participant: {
      name: 'Ananya Sharma',
      email: 'ananya.ece@college.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      role: 'Student (ECE)'
    },
    itemTitle: 'Black Leather Wallet',
    lastMessage: 'Can you verify where you lost it?',
    lastTime: '10:45 AM',
    unread: 1,
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi, I think this might be my wallet.', time: '10:42 AM' },
      { id: 'm2', sender: 'them', text: 'Hi! Can you verify where you lost it and what cards were inside?', time: '10:45 AM' }
    ]
  },
  {
    id: 'conv-2',
    participant: {
      name: 'Rohan Verma',
      email: 'rohan.ece@college.edu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      role: 'Student (ECE)'
    },
    itemTitle: 'Blue Milton Water Bottle',
    lastMessage: 'Yes, it has the IEEE sticker near the lid!',
    lastTime: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey, I found a blue Milton bottle in ECE hall.', time: 'Yesterday' },
      { id: 'm2', sender: 'user', text: 'Does it have any stickers on it?', time: 'Yesterday' },
      { id: 'm3', sender: 'them', text: 'Yes, it has the IEEE sticker near the lid!', time: 'Yesterday' }
    ]
  },
  {
    id: 'conv-3',
    participant: {
      name: 'M. Murugan (Security)',
      email: 'security.gate1@college.edu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      role: 'Security Staff'
    },
    itemTitle: 'House Keys (Batman Keychain)',
    lastMessage: 'Your keys are safely deposited at Gate 1.',
    lastTime: 'Sep 26',
    unread: 0,
    messages: [
      { id: 'm1', sender: 'them', text: 'Your keys are safely deposited at Gate 1 desk. Please bring ID to collect.', time: 'Sep 26' }
    ]
  }
];

export default function Messages() {
  const location = useLocation();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState('conv-1');
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputMessage,
      time: 'Just now'
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: inputMessage,
              lastTime: 'Just now',
              messages: [...c.messages, newMsg]
            }
          : c
      )
    );

    setInputMessage('');
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden h-[calc(100vh-140px)] min-h-[500px] flex flex-col md:flex-row">
      {/* Left Sidebar: Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Messages
            </h2>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              Campus Chat
            </span>
          </div>
          {/* Search Conv Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Conversation Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConvs.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                activeConvId === conv.id ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-100/70'
              }`}
            >
              <img
                src={conv.participant.avatar}
                alt={conv.participant.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{conv.participant.name}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{conv.lastTime}</span>
                </div>
                <p className="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
                  Item: {conv.itemTitle}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            {/* Chat Top Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeConv.participant.name}</h3>
                  <p className="text-[11px] text-slate-500">
                    {activeConv.participant.role} • Regarding: <span className="font-semibold text-indigo-600">{activeConv.itemTitle}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Calling ${activeConv.participant.name} (Campus extension simulated)`)}
                  className="p-2 text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                  title="Call User"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
              <div className="text-center my-2">
                <span className="text-[10px] font-semibold bg-slate-200/70 text-slate-600 px-2.5 py-1 rounded-full">
                  Campus Verified User Connection
                </span>
              </div>

              {activeConv.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message about the item..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-2" />
            <p className="text-xs">Select a conversation from the left menu</p>
          </div>
        )}
      </div>
    </div>
  );
}
