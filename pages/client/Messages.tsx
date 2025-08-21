import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import { Conversation, Message } from '../../types';

const mockConversation: Conversation = {
    id: 'client-convo-1',
    participantName: 'MGS SmartCredit',
    participantAvatar: 'https://i.pravatar.cc/150?u=admin',
    channel: 'email',
    messages: [
      { id: 'msg1-1', sender: 'participant', content: 'Hi, welcome to the client portal! We are reviewing your documents and will begin the dispute process shortly. Feel free to ask any questions here.', timestamp: 'Yesterday' },
      { id: 'msg1-2', sender: 'user', content: 'Thanks! Just wondering about the Capital One account, is that something we can dispute?', timestamp: 'Yesterday' },
      { id: 'msg1-3', sender: 'participant', content: 'Absolutely. We\'ve marked that for the first round of disputes. We\'ll keep you updated on its progress right here.', timestamp: '10:30 AM' },
    ],
};

const ClientMessagesPage: React.FC = () => {
    const [conversation, setConversation] = useState<Conversation>(mockConversation);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversation(prev => ({...prev, messages: [...prev.messages, message]}));
        setNewMessage('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Card noPadding>
                <div className="flex flex-col h-[calc(100vh-250px)] bg-slate-50">
                    <div className="flex items-center p-4 border-b border-slate-200/80 bg-white">
                        <img src={conversation.participantAvatar} alt={conversation.participantName} className="w-10 h-10 rounded-full" />
                        <h2 className="ml-3 text-lg font-semibold">{conversation.participantName}</h2>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            {conversation.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-lg'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-slate-400'}`}>{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="p-4 bg-white border-t border-slate-200/80">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <Input
                                className="flex-1"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                autoComplete="off"
                            />
                            <Button type="submit" size="md" disabled={!newMessage.trim()}>
                                <Send size={16} />
                            </Button>
                        </form>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ClientMessagesPage;
