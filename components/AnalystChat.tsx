
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CompanyData } from '../types';
import { MessageSquare, X, Send, Bot, User, Sparkles, Paperclip, Image as ImageIcon, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  data: CompanyData;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 string for display
  groundingSources?: { title: string; uri: string }[];
}

export const AnalystChat: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `**Analyste Senior** en ligne.\n\nJe dispose des données financières de **${data.company.name}** et d'un accès **Google Search** en temps réel.\n\nVous pouvez me poser des questions complexes, coller des graphiques ou demander des tableaux comparatifs.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset chat when data changes
  useEffect(() => {
    setMessages([{ role: 'model', text: `**Analyste Senior** en ligne.\n\nJe dispose des données financières de **${data.company.name}** et d'un accès **Google Search** en temps réel.\n\nVous pouvez me poser des questions complexes, coller des graphiques ou demander des tableaux comparatifs.` }]);
  }, [data.company.ticker]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, loading]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => setAttachedImage(event.target?.result as string);
            reader.readAsDataURL(blob!);
        }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => setAttachedImage(event.target?.result as string);
          reader.readAsDataURL(file);
      }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || loading) return;
    
    const userText = input;
    const userImage = attachedImage;
    
    // Clear Input
    setInput("");
    setAttachedImage(null);

    // Add User Message to UI
    setMessages(prev => [...prev, { role: 'user', text: userText, image: userImage || undefined }]);
    setLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Prepare history for context
        // NOTE: Standard chat history often sends just text, but mixed modal history is supported in newer models.
        // For simplicity and stability, we re-inject the system instruction context strongly.
        const history: any[] = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }] // Simplifying history to text-only for previous turns to avoid complex mime handling in history for now
        }));

        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            history: history,
            config: {
                // Enable Search
                tools: [{ googleSearch: {} }],
                systemInstruction: `You are a Senior Financial Analyst & Corporate Governance Expert (Finance Source Bot). 
                
                CONTEXT:
                - Company: ${data.company.name} (${data.company.ticker})
                - Sector: ${data.company.sector}
                - Key Financials provided in JSON: ${JSON.stringify(data.indices)}
                
                CAPABILITIES:
                - You can read images (charts, tables) provided by the user.
                - You MUST use Google Search to get the latest 2024-2025 news, stock price, or controversies if asked.
                
                FORMATTING RULES:
                - Use **Bold** for key figures and entities.
                - Use *Italic* for emphasis.
                - Use Markdown Tables for comparisons.
                - ALWAYS format links as [Source Title](url).
                - Use lists (-) for readability.
                - Answer in FRENCH.
                `
            }
        });

        // Construct current message parts
        const parts: any[] = [];
        if (userText) parts.push({ text: userText });
        
        if (userImage) {
            // Remove header "data:image/xyz;base64,"
            const base64Data = userImage.split(',')[1];
            const mimeType = userImage.split(';')[0].split(':')[1];
            parts.push({ inlineData: { mimeType, data: base64Data } });
        }

        const result = await chat.sendMessage({ message: parts });
        const responseText = result.text;
        
        // Extract Grounding (Sources)
        let sources: { title: string; uri: string }[] = [];
        const grounding = result.candidates?.[0]?.groundingMetadata;
        if (grounding?.groundingChunks) {
             sources = grounding.groundingChunks
                .map((c: any) => ({ title: c.web?.title || 'Source Web', uri: c.web?.uri }))
                .filter((s: any) => s.uri);
        }

        setMessages(prev => [...prev, { role: 'model', text: responseText, groundingSources: sources }]);

    } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "⚠️ Erreur: Je n'ai pas pu joindre le serveur ou traiter votre image. Veuillez réessayer." }]);
    }
    setLoading(false);
  };

  return (
    <>
        {/* Toggle Button */}
        <button 
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center gap-2 ${isOpen ? 'scale-0' : 'scale-100'}`}
        >
            <MessageSquare size={24} fill="currentColor" />
            <span className="font-bold pr-2 hidden md:inline">Analyste Senior</span>
        </button>

        {/* Chat Window */}
        <div className={`fixed bottom-6 right-6 z-50 w-[450px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-6rem)] bg-[#1c202e] border border-white/10 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
            
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-[#0b0d12]/50 rounded-t-2xl flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-white/10 relative">
                        <Bot size={20} className="text-white" />
                        <div className="absolute -bottom-1 -right-1 bg-[#1c202e] rounded-full p-0.5">
                            <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full border border-[#1c202e]"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Analyste Senior</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Search size={10} /> Google Search Active
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#0b0d12]/20">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600/20 text-indigo-400'}`}>
                            {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                        </div>

                        {/* Content Bubble */}
                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            
                            {/* User Image Attachment */}
                            {msg.image && (
                                <img src={msg.image} alt="User attachment" className="max-w-full h-auto rounded-lg mb-2 border border-white/10" style={{ maxHeight: '200px' }} />
                            )}

                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm w-full overflow-hidden ${
                                msg.role === 'user' 
                                ? 'bg-slate-700 text-white rounded-tr-sm' 
                                : 'bg-[#1c202e] border border-white/5 text-slate-200 rounded-tl-sm'
                            }`}>
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Style Tables
                                        table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full border-collapse border border-white/10 text-xs" {...props} /></div>,
                                        thead: ({node, ...props}) => <thead className="bg-white/5 text-slate-300" {...props} />,
                                        th: ({node, ...props}) => <th className="border border-white/10 px-3 py-2 text-left font-bold" {...props} />,
                                        td: ({node, ...props}) => <td className="border border-white/10 px-3 py-2 text-slate-400" {...props} />,
                                        // Style Links
                                        a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                                        // Style Lists
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2 text-slate-300" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 my-2 text-slate-300" {...props} />,
                                        // Style Bold/Italic
                                        strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>

                            {/* Google Grounding Sources */}
                            {msg.groundingSources && msg.groundingSources.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.groundingSources.slice(0, 3).map((source, i) => (
                                        <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-[#0b0d12] border border-white/10 px-2 py-1 rounded-full text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors flex items-center gap-1 max-w-[200px] truncate">
                                            <Search size={8} /> {source.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex shrink-0 items-center justify-center">
                            <Sparkles size={14} />
                        </div>
                        <div className="bg-[#1c202e] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#1c202e] rounded-b-2xl">
                
                {/* Image Preview */}
                {attachedImage && (
                    <div className="mb-3 relative inline-block">
                        <img src={attachedImage} alt="Preview" className="h-16 rounded-lg border border-white/20" />
                        <button 
                            onClick={() => setAttachedImage(null)}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors shadow-md"
                        >
                            <X size={10} />
                        </button>
                    </div>
                )}

                <div className="relative flex items-center gap-2">
                    {/* File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-3 rounded-xl transition-colors ${attachedImage ? 'bg-indigo-600/20 text-indigo-400' : 'bg-[#0b0d12] text-slate-400 hover:text-white border border-white/10'}`}
                        title="Joindre une image (ou coller)"
                    >
                        <Paperclip size={18} />
                    </button>

                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        onPaste={handlePaste}
                        placeholder="Posez une question ou collez une image..."
                        className="flex-1 bg-[#0b0d12] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                        autoComplete="off"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={(!input.trim() && !attachedImage) || loading}
                        className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Send size={14} />
                    </button>
                </div>
                <div className="text-[10px] text-slate-600 mt-2 flex justify-center items-center gap-4">
                     <span className="flex items-center gap-1"><Paperclip size={8} /> Images supportées</span>
                     <span className="flex items-center gap-1"><Search size={8} /> Recherche Web auto</span>
                </div>
            </div>
        </div>
    </>
  );
};
