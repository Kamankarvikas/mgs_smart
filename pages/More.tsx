import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Button, Input, Modal } from '../components/ui';
import { TeamMember, Conversation, Message, LetterTemplate } from '../types';
import { PlusCircle, Mail, MessageSquare, AtSign, Phone, User, CheckCircle, Image as ImageIcon, UploadCloud, Trash2, File as FileIcon, Search, MoreVertical, Edit, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useTheme, useAppSettings } from '../App';

// --- LETTERS PAGE ---

const mockLetterTemplates: LetterTemplate[] = [
  { id: 'LT001', title: 'Initial Credit Bureau Dispute', category: 'Dispute', description: 'Standard first-round dispute letter for inaccuracies.', content: 'To Whom It May Concern,\n\nI am writing to dispute the following information in my file...' },
  { id: 'LT002', title: 'HIPAA Medical Collection Dispute', category: 'HIPAA', description: 'Letter to challenge medical collections based on HIPAA violations.', content: 'This letter is a formal request for validation of a medical debt...' },
  { id: 'LT003', title: 'Debt Validation Request', category: 'Debt Validation', description: 'Request for a debt collector to prove you owe the money.', content: 'I am sending this written notice to you to request that you provide me with validation of the debt referenced above...' },
  { id: 'LT004', title: 'Goodwill Letter for Late Payment', category: 'Goodwill', description: 'A letter asking a creditor to remove a late payment as a gesture of goodwill.', content: 'I am writing to respectfully request that you consider making a "goodwill" adjustment to your reporting to the credit bureaus...' },
  { id: 'LT005', title: 'Follow-up on No Response', category: 'Follow-up', description: 'Letter to send when a credit bureau has not responded within 30 days.', content: 'I am writing to follow up on a dispute letter I sent on [Date]...' },
  { id: 'LT006', title: 'Identity Theft Dispute', category: 'Dispute', description: 'Letter for accounts opened fraudulently due to identity theft.', content: 'I am a victim of identity theft, and I am writing to dispute the fraudulent account listed on my credit report...' },
  { id: 'LT007', title: 'Custom Welcome Letter', category: 'Custom', description: 'A custom welcome letter for new clients.', content: 'Welcome to our credit repair program! We are excited to work with you...' },
];

const LetterTemplateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (template: LetterTemplate) => void;
    templateToEdit: LetterTemplate | null;
}> = ({ isOpen, onClose, onSave, templateToEdit }) => {
    const getInitialFormData = (): Omit<LetterTemplate, 'id'> => ({
        title: '', description: '', category: 'Custom', content: ''
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (isOpen) {
            setFormData(templateToEdit || getInitialFormData());
        }
    }, [templateToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (!formData.title || !formData.content) return;
        const templateData: LetterTemplate = {
            ...formData,
            id: templateToEdit?.id || `LT${Date.now()}`,
        };
        onSave(templateData);
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={templateToEdit ? 'Edit Letter Template' : 'Add Custom Letter'}
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Letter</Button></>}
        >
            <div className="space-y-4">
                <Input label="Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Initial Dispute Letter" />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Dispute</option><option>HIPAA</option><option>Debt Validation</option><option>Goodwill</option><option>Follow-up</option><option>Custom</option>
                    </select>
                </div>
                <Input label="Description" name="description" value={formData.description} onChange={handleChange} placeholder="A brief description of the letter's purpose" />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Content</label>
                    <textarea name="content" value={formData.content} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" rows={8}></textarea>
                </div>
            </div>
        </Modal>
    );
};

const DeleteLetterModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; templateTitle: string; }> = ({ isOpen, onClose, onConfirm, templateTitle }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Letter Template" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={onConfirm}>Delete</Button></>}>
        <p className="text-slate-600">Are you sure you want to delete the template <strong className="text-primary">{templateTitle}</strong>? This action cannot be undone.</p>
    </Modal>
);

const LetterPreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    template: LetterTemplate | null;
}> = ({ isOpen, onClose, template }) => {
    if (!isOpen || !template) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={template.title}
            footer={<Button onClick={onClose}>Close</Button>}
        >
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">Category</p>
                    <p className="font-semibold">{template.category}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">Description</p>
                    <p className="text-slate-700">{template.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-200/80">
                    <p className="text-sm font-medium text-slate-500 mb-2">Content</p>
                    <div className="max-h-64 overflow-y-auto bg-slate-50 p-4 rounded-md border border-slate-200/80">
                        <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans">{template.content}</pre>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export const LettersPage: React.FC = () => {
  const [templates, setTemplates] = useState<LetterTemplate[]>(mockLetterTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<LetterTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<LetterTemplate | null>(null);
  const [templateToPreview, setTemplateToPreview] = useState<LetterTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
            setOpenActionMenu(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates
        .filter(template => categoryFilter === 'All' || template.category === categoryFilter)
        .filter(template =>
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
  }, [templates, searchQuery, categoryFilter]);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);

  const handleOpenModal = (template: LetterTemplate | null = null) => {
    setTemplateToEdit(template);
    setIsModalOpen(true);
    setOpenActionMenu(null);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setTemplateToEdit(null);
  };
  
  const handleOpenPreview = (template: LetterTemplate) => {
    setTemplateToPreview(template);
  };

  const handleClosePreview = () => {
    setTemplateToPreview(null);
  };

  const handleSaveTemplate = (templateData: LetterTemplate) => {
    setTemplates(prev => {
        const exists = prev.some(t => t.id === templateData.id);
        if (exists) {
            return prev.map(t => t.id === templateData.id ? templateData : t);
        }
        return [templateData, ...prev];
    });
    handleCloseModal();
  };

  const handleDelete = () => {
      if (!templateToDelete) return;
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
      setTemplateToDelete(null);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(<button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 rounded-md text-sm ${currentPage === i ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}>{i}</button>);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Letter Templates</h1>
          <p className="text-slate-500">Manage your custom dispute letters.</p>
        </div>
        <Button onClick={() => handleOpenModal()}><PlusCircle size={18} className="mr-2" /> Add Custom Letter</Button>
      </div>

      <Card noPadding>
        <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
                <Input placeholder="Search by title or description..." icon={<Search size={16} className="text-slate-400" />} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="border border-slate-300 rounded-lg text-sm focus:ring-primary focus:border-primary">
                <option value="All">All Categories</option><option>Dispute</option><option>HIPAA</option><option>Debt Validation</option><option>Goodwill</option><option>Follow-up</option><option>Custom</option>
            </select>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/80">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200/80">
                    {paginatedTemplates.map(template => (
                        <tr key={template.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleOpenPreview(template)}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{template.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">{template.category}</span></td>
                            <td className="px-6 py-4 text-sm text-slate-500 max-w-sm truncate">{template.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="relative inline-block text-left" ref={openActionMenu === template.id ? actionMenuRef : null}>
                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === template.id ? null : template.id); }}><MoreVertical size={16}/></Button>
                                    {openActionMenu === template.id && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                            <div className="py-1" role="menu" aria-orientation="vertical">
                                                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(template); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem"><Edit size={14} className="mr-2" /> Edit</button>
                                                <button onClick={(e) => { e.stopPropagation(); setTemplateToDelete(template); setOpenActionMenu(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem"><Trash2 size={14} className="mr-2" /> Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
         <div className="p-4 border-t border-slate-200/80 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {paginatedTemplates.length} of {filteredTemplates.length} results</p>
            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                    {renderPagination()}
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                </div>
            )}
        </div>
      </Card>

      <LetterTemplateModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTemplate} templateToEdit={templateToEdit} />
      {templateToDelete && <DeleteLetterModal isOpen={!!templateToDelete} onClose={() => setTemplateToDelete(null)} onConfirm={handleDelete} templateTitle={templateToDelete.title} />}
      <LetterPreviewModal isOpen={!!templateToPreview} onClose={handleClosePreview} template={templateToPreview} />
    </div>
  );
};

// --- INBOX PAGE ---
const mockConversations: Conversation[] = [
  {
    id: 'convo-email-1',
    participantName: 'Emily White',
    participantAvatar: 'https://i.pravatar.cc/150?u=emily',
    channel: 'email',
    messages: [
      { id: 'msg1-1', sender: 'participant', content: 'Hi, I was wondering about the status of my Capital One dispute. Any updates?', timestamp: 'Yesterday' },
      { id: 'msg1-2', sender: 'user', content: 'Hello Emily, we received a response and it was a positive outcome! The incorrect late payment was removed.', timestamp: 'Yesterday' },
      { id: 'msg1-3', sender: 'participant', content: 'That is fantastic news! Thank you so much for your help.', timestamp: '10:30 AM' },
    ],
    unreadCount: 1,
  },
  {
    id: 'convo-sms-1',
    participantName: 'Michael Green',
    participantAvatar: 'https://i.pravatar.cc/150?u=michael',
    channel: 'sms',
    messages: [
      { id: 'msg3-1', sender: 'user', content: 'Hi Michael, quick reminder to send us your latest utility bill for proof of address. Thanks!', timestamp: '9:15 AM' },
      { id: 'msg3-2', sender: 'participant', content: 'Will do. I can send it over this afternoon.', timestamp: '9:17 AM' },
    ],
  },
  {
    id: 'convo-email-2',
    participantName: 'David Black',
    participantAvatar: 'https://i.pravatar.cc/150?u=david',
    channel: 'email',
    messages: [
      { id: 'msg2-1', sender: 'participant', content: 'I have uploaded the documents you requested. Please confirm you have received them.', timestamp: '3 days ago' },
      { id: 'msg2-2', sender: 'user', content: 'Got them, David. Thanks! We will begin drafting the next round of letters now.', timestamp: '3 days ago' },
    ],
  },
   {
    id: 'convo-sms-2',
    participantName: 'Laura Grey',
    participantAvatar: 'https://i.pravatar.cc/150?u=laura',
    channel: 'sms',
    messages: [
      { id: 'msg4-1', sender: 'participant', content: 'Hi, just wanted to check in on the progress.', timestamp: 'Mon 2:45 PM' },
    ],
  },
];

const ConversationListItem: React.FC<{ conv: Conversation; isSelected: boolean; onClick: () => void }> = ({ conv, isSelected, onClick }) => {
    const lastMessage = conv.messages[conv.messages.length - 1];
    return (
        <div
            onClick={onClick}
            className={`flex items-start p-3 cursor-pointer border-l-4 ${isSelected ? 'border-primary bg-primary-bg-hover' : 'border-transparent hover:bg-slate-50'}`}
        >
            <img src={conv.participantAvatar} alt={conv.participantName} className="w-10 h-10 rounded-full" />
            <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-slate-800">{conv.participantName}</p>
                    <p className="text-xs text-slate-400">{lastMessage.timestamp}</p>
                </div>
                <div className="flex justify-between items-start">
                    <p className="text-sm text-slate-500 truncate pr-2">{lastMessage.content}</p>
                    {conv.unreadCount && conv.unreadCount > 0 && <span className="w-2 h-2 mt-1.5 bg-primary rounded-full flex-shrink-0"></span>}
                </div>
            </div>
        </div>
    );
};

export const InboxPage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(mockConversations[0]?.id || null);
    const [newMessage, setNewMessage] = useState('');
    const [isChatVisibleOnMobile, setIsChatVisibleOnMobile] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const allConversations = useMemo(() =>
        [...conversations].sort((a,b) => (b.unreadCount || 0) - (a.unreadCount || 0))
    , [conversations]);
    
    const selectedConversation = useMemo(() =>
        conversations.find(c => c.id === selectedConversationId)
    , [conversations, selectedConversationId]);

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
        setIsChatVisibleOnMobile(true);
    };
    
    const handleBackToList = () => {
        setIsChatVisibleOnMobile(false);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversationId) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => prev.map(c =>
            c.id === selectedConversationId ? { ...c, messages: [...c.messages, message] } : c
        ));
        setNewMessage('');
        
        // Simulate a reply
        setTimeout(() => {
            const reply: Message = {
                id: `msg-reply-${Date.now()}`,
                sender: 'participant',
                content: 'Thanks for the update!',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setConversations(prev => prev.map(c =>
                c.id === selectedConversationId ? { ...c, messages: [...c.messages, reply] } : c
            ));
        }, 2000);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Card noPadding>
                <div className="flex h-[calc(100vh-250px)]">
                    <div className={`${isChatVisibleOnMobile ? 'hidden' : 'block'} w-full md:block md:w-1/3 border-r border-slate-200/80 overflow-y-auto`}>
                        <div className="p-3 border-b border-slate-200/80">
                            <Input placeholder="Search messages..." icon={<Search size={16} className="text-slate-400" />} />
                        </div>
                        <div className="divide-y divide-slate-200/80">
                            {allConversations.map(conv => (
                                <ConversationListItem
                                    key={conv.id}
                                    conv={conv}
                                    isSelected={selectedConversationId === conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className={`${isChatVisibleOnMobile ? 'flex' : 'hidden'} w-full md:flex flex-col bg-slate-50`}>
                        {selectedConversation ? (
                            <>
                                <div className="flex items-center p-4 border-b border-slate-200/80 bg-white">
                                    <Button variant="ghost" size="sm" className="mr-2 md:hidden" onClick={handleBackToList}>
                                        <ChevronLeft size={20} />
                                    </Button>
                                    <img src={selectedConversation.participantAvatar} alt={selectedConversation.participantName} className="w-10 h-10 rounded-full" />
                                    <h2 className="ml-3 text-lg font-semibold">{selectedConversation.participantName}</h2>
                                </div>
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <div className="space-y-4">
                                        {selectedConversation.messages.map(msg => (
                                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-lg'}`}>
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-violet-200' : 'text-slate-400'}`}>{msg.timestamp}</p>
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
                            </>
                        ) : (
                            <div className="hidden md:flex flex-col items-center justify-center h-full text-slate-500">
                                <MessageSquare size={48} className="mb-2" />
                                <h2 className="text-lg font-semibold">Select a conversation</h2>
                                <p>Choose a conversation from the left to start messaging.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

// --- TEAM PAGE ---

const mockTeam: TeamMember[] = [
    { id: 'T01', firstName: 'Alice', lastName: 'Johnson', email: 'alice@mgssmartcredit.com', status: 'Active', role: 'Manager', imageUrl: 'https://i.pravatar.cc/150?u=alice', commission: 15 },
    { id: 'T02', firstName: 'Bob', lastName: 'Williams', email: 'bob@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=bob', commission: 10 },
    { id: 'T03', firstName: 'Charlie', lastName: 'Green', email: 'charlie@mgssmartcredit.com', status: 'Inactive', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=charlie', commission: 10 },
    { id: 'T04', firstName: 'Diana', lastName: 'Prince', email: 'diana@mgssmartcredit.com', status: 'Active', role: 'Admin', imageUrl: 'https://i.pravatar.cc/150?u=diana', commission: 20 },
    { id: 'T05', firstName: 'Ethan', lastName: 'Hunt', email: 'ethan@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=ethan', commission: 12 },
    { id: 'T06', firstName: 'Fiona', lastName: 'Glenanne', email: 'fiona@mgssmartcredit.com', status: 'Inactive', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=fiona', commission: 9 },
    { id: 'T07', firstName: 'George', lastName: 'Costanza', email: 'george@mgssmartcredit.com', status: 'Active', role: 'Manager', imageUrl: 'https://i.pravatar.cc/150?u=george', commission: 16 },
    { id: 'T08', firstName: 'Hannah', lastName: 'Montana', email: 'hannah@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=hannah', commission: 11 },
    { id: 'T09', firstName: 'Ian', lastName: 'Malcolm', email: 'ian@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=ian', commission: 10 },
    { id: 'T10', firstName: 'Julia', lastName: 'Roberts', email: 'julia@mgssmartcredit.com', status: 'Inactive', role: 'Admin', imageUrl: 'https://i.pravatar.cc/150?u=julia', commission: 18 },
    { id: 'T11', firstName: 'Kevin', lastName: 'McCallister', email: 'kevin@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=kevin', commission: 13 },
    { id: 'T12', firstName: 'Laura', lastName: 'Palmer', email: 'laura@mgssmartcredit.com', status: 'Active', role: 'Agent', imageUrl: 'https://i.pravatar.cc/150?u=laura', commission: 10 },
];

const TeamMemberModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: TeamMember) => void;
    memberToEdit: TeamMember | null;
}> = ({ isOpen, onClose, onSave, memberToEdit }) => {
    const getInitialFormData = (): Omit<TeamMember, 'id'| 'imageUrl'> => ({
        firstName: '', lastName: '', email: '', commission: 0,
        status: 'Active', role: 'Agent',
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (isOpen) {
            if (memberToEdit) {
                setFormData(memberToEdit);
            } else {
                setFormData(getInitialFormData());
            }
        }
    }, [memberToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'commission' ? Number(value) : value }));
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName || !formData.email) return;
        const memberData: TeamMember = {
            ...formData,
            id: memberToEdit?.id || `T${Date.now()}`,
            imageUrl: memberToEdit?.imageUrl || `https://i.pravatar.cc/150?u=${formData.email}`
        };
        onSave(memberData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={memberToEdit ? 'Edit Team Member' : 'Add Team Member'} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Member</Button></>}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <Input label="Commission (%)" name="commission" type="number" value={String(formData.commission)} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>Agent</option><option>Manager</option><option>Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>Active</option><option>Inactive</option>
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const DeleteConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; memberName: string; }> = ({ isOpen, onClose, onConfirm, memberName }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Team Member" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700 focus:ring-red-500" onClick={onConfirm}>Delete</Button></>}>
        <p className="text-slate-600">Are you sure you want to delete <strong className="text-primary">{memberName}</strong>? This action cannot be undone.</p>
    </Modal>
);

export const TeamPage: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>(mockTeam);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTeam = useMemo(() => {
        return team
            .filter(member => statusFilter === 'All' || member.status === statusFilter)
            .filter(member => roleFilter === 'All' || member.role === roleFilter)
            .filter(member =>
                `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [team, searchQuery, statusFilter, roleFilter]);

    const paginatedTeam = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTeam.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTeam, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);

    const handleOpenModal = (member: TeamMember | null = null) => {
        setMemberToEdit(member);
        setIsModalOpen(true);
        setOpenActionMenu(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMemberToEdit(null);
    };

    const handleSaveMember = (memberData: TeamMember) => {
        setTeam(prev => {
            const exists = prev.some(m => m.id === memberData.id);
            if (exists) {
                return prev.map(m => (m.id === memberData.id ? memberData : m));
            }
            return [memberData, ...prev];
        });
        handleCloseModal();
    };

    const handleDelete = () => {
        if (!memberToDelete) return;
        setTeam(prev => prev.filter(m => m.id !== memberToDelete.id));
        setMemberToDelete(null);
    };
    
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(<button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 rounded-md text-sm ${currentPage === i ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}>{i}</button>);
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Team</h1>
                    <p className="text-slate-500">Manage your team members, roles, and permissions.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><PlusCircle size={18} className="mr-2" /> Add Team Member</Button>
            </div>

            <Card noPadding>
                <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Input placeholder="Search by name or email..." icon={<Search size={16} className="text-slate-400" />} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <div className="flex gap-4">
                        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border border-slate-300 rounded-lg text-sm focus:ring-primary focus:border-primary">
                            <option value="All">All Statuses</option><option value="Active">Active</option><option value="Inactive">Inactive</option>
                        </select>
                        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="border border-slate-300 rounded-lg text-sm focus:ring-primary focus:border-primary">
                            <option value="All">All Roles</option><option value="Admin">Admin</option><option value="Manager">Manager</option><option value="Agent">Agent</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/80">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200/80">
                            {paginatedTeam.map(member => (
                                <tr key={member.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={member.imageUrl} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{member.firstName} {member.lastName}</div>
                                                <div className="text-sm text-slate-500">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{member.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.commission}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left" ref={openActionMenu === member.id ? actionMenuRef : null}>
                                            <Button variant="ghost" size="sm" onClick={() => setOpenActionMenu(openActionMenu === member.id ? null : member.id)}><MoreVertical size={16}/></Button>
                                            {openActionMenu === member.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={() => handleOpenModal(member)} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem"><Edit size={14} className="mr-2" /> Edit</button>
                                                        <button onClick={() => { setMemberToDelete(member); setOpenActionMenu(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem"><Trash2 size={14} className="mr-2" /> Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t border-slate-200/80 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing {paginatedTeam.length} of {filteredTeam.length} results</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                            {renderPagination()}
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                        </div>
                    )}
                </div>
            </Card>

            <TeamMemberModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveMember} memberToEdit={memberToEdit} />
            {memberToDelete && <DeleteConfirmationModal isOpen={!!memberToDelete} onClose={() => setMemberToDelete(null)} onConfirm={handleDelete} memberName={`${memberToDelete.firstName} ${memberToDelete.lastName}`} />}
        </div>
    );
};

// --- SETTINGS PAGE ---
const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; description: string; }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium text-slate-800">{label}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            type="button"
            className={`${checked ? 'bg-primary' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
    </div>
);


export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme, themes } = useTheme();
  const { settings, updateSettings } = useAppSettings();
  
  // General Settings State
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [supportEmail, setSupportEmail] = useState('support@mgssmartcredit.com');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGeneralSaved, setIsGeneralSaved] = useState(false);

  useEffect(() => {
    setCompanyName(settings.companyName);
  }, [settings.companyName]);

  const handleGeneralSave = () => {
    updateSettings({ companyName });
    setIsGeneralSaved(true);
    setTimeout(() => setIsGeneralSaved(false), 2000);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  
  // Compliance Settings State
  const [complianceToggles, setComplianceToggles] = useState({ croa: true, eSig: true, reminders: true });
  const [licensingDocs, setLicensingDocs] = useState<{id: string; name: string}[]>([ { id: 'doc1', name: 'California License.pdf' }, { id: 'doc2', name: 'Texas Bond.pdf' }, ]);
  const [isComplianceSaved, setIsComplianceSaved] = useState(false);

  const handleDocUpload = () => {
      const newDoc = { id: `doc${Date.now()}`, name: `New_License_${licensingDocs.length+1}.pdf` };
      setLicensingDocs(prev => [...prev, newDoc]);
  };
  const handleDocDelete = (id: string) => setLicensingDocs(prev => prev.filter(doc => doc.id !== id));
  
  const handleComplianceSave = () => {
    // In a real app, this would save to a backend.
    setIsComplianceSaved(true);
    setTimeout(() => setIsComplianceSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <nav className="flex flex-col space-y-2">
            <button onClick={() => setActiveTab('general')} className={`flex items-center px-4 py-2 rounded-lg text-left ${activeTab === 'general' ? 'bg-primary-bg-active text-primary' : 'hover:bg-slate-100'}`}>
                <User size={16} className="mr-2" /> General
            </button>
             <button onClick={() => setActiveTab('appearance')} className={`flex items-center px-4 py-2 rounded-lg text-left ${activeTab === 'appearance' ? 'bg-primary-bg-active text-primary' : 'hover:bg-slate-100'}`}>
                <ImageIcon size={16} className="mr-2" /> Appearance
            </button>
            <button onClick={() => setActiveTab('compliance')} className={`flex items-center px-4 py-2 rounded-lg text-left ${activeTab === 'compliance' ? 'bg-primary-bg-active text-primary' : 'hover:bg-slate-100'}`}>
                <CheckCircle size={16} className="mr-2" /> Compliance
            </button>
          </nav>
        </div>
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
              <Card>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold">General Settings</h2>
                    <Button onClick={handleGeneralSave} disabled={isGeneralSaved}>
                      {isGeneralSaved ? <><CheckCircle size={16} className="mr-2" /> Saved!</> : 'Save Changes'}
                    </Button>
                </div>
                <div className="space-y-6">
                    <Input label="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    <Input label="Support Email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Company Logo</label>
                        <div className="mt-1 flex items-center gap-4">
                            <span className="h-20 w-20 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                                {logoPreview ? <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-cover" /> : <ImageIcon size={32} className="text-slate-400" />}
                            </span>
                            <input type="file" id="logo-upload" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange}/>
                            <Button variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                                <UploadCloud size={16} className="mr-2" /> Change Logo
                            </Button>
                        </div>
                    </div>
                </div>
              </Card>
            )}
            {activeTab === 'appearance' && (
              <Card>
                 <div className="mb-4 pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold">Appearance</h2>
                </div>
                <div>
                    <h3 className="text-base font-semibold mb-2">Theme Color</h3>
                    <p className="text-sm text-slate-500 mb-4">Choose the primary color for your workspace. The change is applied instantly.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {themes.map(t => (
                            <div key={t.name} className="flex flex-col items-center">
                                <button
                                    onClick={() => setTheme(t.name)}
                                    className={`w-16 h-16 rounded-full transition-all ${theme.name === t.name ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                                    style={{ backgroundColor: `rgb(${t.colors.primary})` }}
                                    aria-label={`Select ${t.name} theme`}
                                ></button>
                                <span className="mt-2 text-sm font-medium text-slate-600">{t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
              </Card>
            )}
            {activeTab === 'compliance' && (
              <Card>
                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-semibold">Compliance Settings</h2>
                    <Button onClick={handleComplianceSave} disabled={isComplianceSaved}>
                      {isComplianceSaved ? <><CheckCircle size={16} className="mr-2" /> Saved!</> : 'Save Changes'}
                    </Button>
                </div>
                 <div className="space-y-8">
                    <div className="space-y-4">
                        <Switch checked={complianceToggles.croa} onChange={v => setComplianceToggles(p => ({...p, croa:v}))} label="CROA Compliance" description="Enforce Credit Repair Organizations Act disclosures." />
                        <Switch checked={complianceToggles.eSig} onChange={v => setComplianceToggles(p => ({...p, eSig:v}))} label="E-Signature Agreements" description="Require clients to e-sign contracts and documents." />
                        <Switch checked={complianceToggles.reminders} onChange={v => setComplianceToggles(p => ({...p, reminders:v}))} label="Expiry Reminders" description="Send reminders for expiring compliance documents." />
                    </div>
                    <div className="pt-6 border-t border-slate-200/80">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-base font-semibold">State Licensing Documents</h3>
                                <p className="text-sm text-slate-500">Manage your state-specific licenses and bonds.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleDocUpload}><UploadCloud size={16} className="mr-2" /> Upload</Button>
                        </div>
                        <div className="mt-4 space-y-2">
                        {licensingDocs.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                                <div className="flex items-center">
                                    <FileIcon size={18} className="text-slate-500"/>
                                    <span className="ml-3 font-medium text-sm text-slate-800">{doc.name}</span>
                                </div>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDocDelete(doc.id)}><Trash2 size={16}/></Button>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};