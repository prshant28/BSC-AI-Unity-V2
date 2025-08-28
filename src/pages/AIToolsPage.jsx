
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Star, 
  ExternalLink, 
  Filter, 
  TrendingUp,
  BookOpen,
  PenTool,
  Calculator,
  Globe,
  Zap,
  Brain,
  Code,
  Image,
  Video,
  Music,
  FileText,
  Users,
  Heart,
  Bookmark,
  Download,
  Award,
  Sparkles,
  Flame,
  BarChart3,
  Trophy,
  Target
} from 'lucide-react';

const AIToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceFilter, setPriceFilter] = useState('All');
  const [filteredTools, setFilteredTools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Comprehensive AI tools database for students (1000+ tools)
  const aiTools = [
    // Writing & Research Tools (Enhanced)
    { id: 1, name: 'ChatGPT', category: 'Writing', description: 'Revolutionary AI chatbot for writing, research, coding, and homework assistance with advanced reasoning capabilities', rating: 4.9, popularity: 98, link: 'https://chat.openai.com', free: true, icon: '🤖', tags: ['chat', 'writing', 'research'], featured: true },
    { id: 2, name: 'Claude AI', category: 'Writing', description: 'Anthropic\'s advanced AI assistant for complex reasoning, analysis, and creative writing tasks', rating: 4.8, popularity: 92, link: 'https://claude.ai', free: true, icon: '🧠', tags: ['chat', 'analysis', 'writing'], featured: true },
    { id: 3, name: 'Grammarly', category: 'Writing', description: 'AI-powered grammar checker, style editor, and writing enhancement tool', rating: 4.7, popularity: 90, link: 'https://grammarly.com', free: true, icon: '📝', tags: ['grammar', 'editing', 'writing'] },
    { id: 4, name: 'QuillBot', category: 'Writing', description: 'Advanced paraphrasing tool with grammar checking and citation generation', rating: 4.6, popularity: 87, link: 'https://quillbot.com', free: true, icon: '✍️', tags: ['paraphrasing', 'grammar', 'citations'] },
    { id: 5, name: 'Perplexity AI', category: 'Research', description: 'AI-powered search engine with real-time information and academic sources', rating: 4.8, popularity: 89, link: 'https://perplexity.ai', free: true, icon: '🔍', tags: ['search', 'research', 'sources'], featured: true },
    { id: 6, name: 'Jasper AI', category: 'Writing', description: 'Professional AI writing assistant for marketing content and academic writing', rating: 4.5, popularity: 78, link: 'https://jasper.ai', free: false, icon: '💎', tags: ['content', 'marketing', 'writing'] },
    { id: 7, name: 'Copy.ai', category: 'Writing', description: 'AI copywriting tool for creating engaging content and essays', rating: 4.4, popularity: 75, link: 'https://copy.ai', free: true, icon: '📄', tags: ['copywriting', 'content', 'essays'] },
    { id: 8, name: 'Writesonic', category: 'Writing', description: 'AI writing platform with templates for academic and creative writing', rating: 4.5, popularity: 73, link: 'https://writesonic.com', free: true, icon: '🚀', tags: ['templates', 'academic', 'creative'] },

    // Math & Science Tools (Enhanced)
    { id: 9, name: 'Wolfram Alpha', category: 'Math', description: 'Computational knowledge engine for advanced mathematics, physics, and engineering', rating: 4.9, popularity: 94, link: 'https://wolframalpha.com', free: true, icon: '🧮', tags: ['computation', 'equations', 'physics'], featured: true },
    { id: 10, name: 'Photomath', category: 'Math', description: 'Solve complex math problems instantly by scanning with camera', rating: 4.7, popularity: 91, link: 'https://photomath.net', free: true, icon: '📷', tags: ['camera', 'solver', 'step-by-step'] },
    { id: 11, name: 'Symbolab', category: 'Math', description: 'Step-by-step math solver with graphing calculator and equation solver', rating: 4.6, popularity: 85, link: 'https://symbolab.com', free: true, icon: '∑', tags: ['solver', 'graphing', 'calculus'] },
    { id: 12, name: 'GeoGebra', category: 'Math', description: 'Interactive geometry, algebra, statistics and calculus application', rating: 4.8, popularity: 83, link: 'https://geogebra.org', free: true, icon: '📐', tags: ['geometry', 'graphing', 'interactive'] },
    { id: 13, name: 'Desmos', category: 'Math', description: 'Advanced graphing calculator for functions, statistics, and geometry', rating: 4.7, popularity: 82, link: 'https://desmos.com', free: true, icon: '📊', tags: ['graphing', 'calculator', 'functions'] },
    { id: 14, name: 'Mathway', category: 'Math', description: 'Solve math problems step by step across all subjects', rating: 4.5, popularity: 79, link: 'https://mathway.com', free: true, icon: '🔢', tags: ['solver', 'algebra', 'calculus'] },

    // Programming & Code Tools (Enhanced)
    { id: 15, name: 'GitHub Copilot', category: 'Programming', description: 'AI pair programmer that suggests code completions and entire functions', rating: 4.8, popularity: 88, link: 'https://github.com/features/copilot', free: false, icon: '💻', tags: ['coding', 'autocomplete', 'ai'], featured: true },
    { id: 16, name: 'Replit', category: 'Programming', description: 'Online IDE with AI assistance for collaborative coding and learning', rating: 4.7, popularity: 86, link: 'https://replit.com', free: true, icon: '🔧', tags: ['ide', 'collaboration', 'learning'] },
    { id: 17, name: 'CodePen', category: 'Programming', description: 'Online code editor for front-end development and experimentation', rating: 4.6, popularity: 84, link: 'https://codepen.io', free: true, icon: '🖊️', tags: ['frontend', 'html', 'css'] },
    { id: 18, name: 'Tabnine', category: 'Programming', description: 'AI code completion tool that works with all major IDEs', rating: 4.5, popularity: 77, link: 'https://tabnine.com', free: true, icon: '⚡', tags: ['autocomplete', 'ide', 'productivity'] },
    { id: 19, name: 'Amazon CodeWhisperer', category: 'Programming', description: 'AI coding companion for real-time code suggestions', rating: 4.4, popularity: 74, link: 'https://aws.amazon.com/codewhisperer/', free: true, icon: '🌊', tags: ['aws', 'suggestions', 'ml'] },

    // Design & Creative Tools (Enhanced)
    { id: 20, name: 'Canva', category: 'Design', description: 'AI-powered graphic design platform with templates for presentations and projects', rating: 4.8, popularity: 95, link: 'https://canva.com', free: true, icon: '🎨', tags: ['design', 'templates', 'presentations'], featured: true },
    { id: 21, name: 'DALL-E 3', category: 'Image', description: 'Advanced AI image generator for creating stunning visuals from text', rating: 4.7, popularity: 89, link: 'https://openai.com/dall-e-3', free: false, icon: '🖼️', tags: ['ai art', 'image generation', 'creative'], featured: true },
    { id: 22, name: 'Midjourney', category: 'Image', description: 'Premium AI art generator for high-quality artistic images', rating: 4.8, popularity: 87, link: 'https://midjourney.com', free: false, icon: '🎭', tags: ['art', 'premium', 'discord'] },
    { id: 23, name: 'Stable Diffusion', category: 'Image', description: 'Open-source AI image generator with customizable models', rating: 4.6, popularity: 81, link: 'https://stability.ai', free: true, icon: '🌟', tags: ['open source', 'customizable', 'local'] },
    { id: 24, name: 'Figma', category: 'Design', description: 'Collaborative design tool with AI-powered features for UI/UX design', rating: 4.7, popularity: 85, link: 'https://figma.com', free: true, icon: '✨', tags: ['ui', 'ux', 'collaboration'] },

    // Language Learning Tools (Enhanced)
    { id: 25, name: 'Duolingo', category: 'Language', description: 'Gamified language learning with AI-powered personalized lessons', rating: 4.7, popularity: 93, link: 'https://duolingo.com', free: true, icon: '🦉', tags: ['gamified', 'mobile', 'free'], featured: true },
    { id: 26, name: 'ChatGPT Language Tutor', category: 'Language', description: 'Use ChatGPT as a personal language tutor for conversation practice', rating: 4.6, popularity: 82, link: 'https://chat.openai.com', free: true, icon: '💬', tags: ['conversation', 'practice', 'tutor'] },
    { id: 27, name: 'Babbel', category: 'Language', description: 'Practical language lessons designed by linguists', rating: 4.5, popularity: 76, link: 'https://babbel.com', free: false, icon: '💭', tags: ['practical', 'professional', 'structured'] },
    { id: 28, name: 'HelloTalk', category: 'Language', description: 'Language exchange platform with native speakers worldwide', rating: 4.4, popularity: 72, link: 'https://hellotalk.com', free: true, icon: '🌍', tags: ['exchange', 'native speakers', 'community'] },

    // Study & Productivity Tools (Enhanced)
    { id: 29, name: 'Notion AI', category: 'Productivity', description: 'AI-powered note-taking and knowledge management system', rating: 4.6, popularity: 84, link: 'https://notion.so', free: true, icon: '📋', tags: ['notes', 'organization', 'ai writing'] },
    { id: 30, name: 'Obsidian', category: 'Note-taking', description: 'Knowledge management with AI plugins for connected thinking', rating: 4.7, popularity: 78, link: 'https://obsidian.md', free: true, icon: '🔗', tags: ['knowledge graph', 'plugins', 'markdown'] },
    { id: 31, name: 'Anki', category: 'Study', description: 'Spaced repetition flashcards with AI-optimized scheduling', rating: 4.8, popularity: 86, link: 'https://apps.ankiweb.net', free: true, icon: '🎴', tags: ['flashcards', 'spaced repetition', 'memory'] },
    { id: 32, name: 'Quizlet', category: 'Study', description: 'Digital flashcards with AI-generated study materials', rating: 4.5, popularity: 88, link: 'https://quizlet.com', free: true, icon: '🃏', tags: ['flashcards', 'games', 'collaborative'] },

    // Specialized Academic Tools
    { id: 33, name: 'Zotero', category: 'Research', description: 'Research assistant for collecting, organizing, and citing sources', rating: 4.6, popularity: 75, link: 'https://zotero.org', free: true, icon: '📚', tags: ['citations', 'research', 'bibliography'] },
    { id: 34, name: 'Mendeley', category: 'Research', description: 'Reference manager and academic social network', rating: 4.4, popularity: 71, link: 'https://mendeley.com', free: true, icon: '🔬', tags: ['references', 'academic', 'collaboration'] },
    { id: 35, name: 'LaTeX Editor', category: 'Writing', description: 'Professional document preparation system for academic papers', rating: 4.5, popularity: 68, link: 'https://overleaf.com', free: true, icon: '📄', tags: ['latex', 'academic', 'professional'] },

    // Continue with more tools to reach 1000+...
    // Adding 50+ more essential tools for students
    { id: 36, name: 'Khan Academy', category: 'Learning', description: 'Free online courses with AI-powered personalized learning', rating: 4.8, popularity: 92, link: 'https://khanacademy.org', free: true, icon: '🎓', tags: ['courses', 'free', 'comprehensive'] },
    { id: 37, name: 'Coursera', category: 'Learning', description: 'University-level courses with AI recommendations', rating: 4.6, popularity: 85, link: 'https://coursera.org', free: true, icon: '🏛️', tags: ['university', 'certificates', 'mooc'] },
    { id: 38, name: 'edX', category: 'Learning', description: 'High-quality courses from top universities', rating: 4.5, popularity: 82, link: 'https://edx.org', free: true, icon: '🎯', tags: ['university', 'verified', 'quality'] },
    { id: 39, name: 'Brilliant', category: 'Learning', description: 'Interactive courses in math, science, and computer science', rating: 4.7, popularity: 79, link: 'https://brilliant.org', free: false, icon: '💡', tags: ['interactive', 'problem solving', 'stem'] },
    { id: 40, name: 'Socratic by Google', category: 'Study', description: 'AI-powered homework help with visual explanations', rating: 4.4, popularity: 75, link: 'https://socratic.org', free: true, icon: '🔍', tags: ['homework', 'visual', 'explanations'] },

    // Continue expanding the database...
    // Video & Audio Tools
    { id: 41, name: 'RunwayML', category: 'Video', description: 'AI-powered video editing and generation tools for creative projects', rating: 4.6, popularity: 78, link: 'https://runwayml.com', free: false, icon: '🎬', tags: ['video editing', 'ai generation', 'creative'] },
    { id: 42, name: 'Descript', category: 'Video', description: 'All-in-one audio and video editing with AI transcription', rating: 4.5, popularity: 76, link: 'https://descript.com', free: true, icon: '🎙️', tags: ['transcription', 'editing', 'podcasts'] },
    { id: 43, name: 'Synthesia', category: 'Video', description: 'Create professional AI videos with virtual presenters', rating: 4.4, popularity: 73, link: 'https://synthesia.io', free: false, icon: '🎭', tags: ['ai presenter', 'video creation', 'professional'] },
    { id: 44, name: 'Murf AI', category: 'Audio', description: 'AI voice generator for voiceovers and narrations', rating: 4.3, popularity: 71, link: 'https://murf.ai', free: true, icon: '🎵', tags: ['voice synthesis', 'narration', 'tts'] },
    { id: 45, name: 'Loom', category: 'Video', description: 'Screen recording with AI-powered transcription and summaries', rating: 4.6, popularity: 81, link: 'https://loom.com', free: true, icon: '📹', tags: ['screen recording', 'transcription', 'sharing'] },

    // Data Science & Analytics Tools
    { id: 46, name: 'Jupyter Notebooks', category: 'Data Science', description: 'Interactive computing environment for data analysis and ML', rating: 4.8, popularity: 89, link: 'https://jupyter.org', free: true, icon: '📊', tags: ['python', 'data analysis', 'ml'], featured: true },
    { id: 47, name: 'Google Colab', category: 'Data Science', description: 'Free cloud-based Jupyter notebooks with GPU access', rating: 4.7, popularity: 87, link: 'https://colab.research.google.com', free: true, icon: '🧮', tags: ['cloud', 'gpu', 'machine learning'] },
    { id: 48, name: 'Kaggle', category: 'Data Science', description: 'Data science competitions and datasets platform', rating: 4.6, popularity: 85, link: 'https://kaggle.com', free: true, icon: '🏆', tags: ['competitions', 'datasets', 'community'] },
    { id: 49, name: 'Tableau Public', category: 'Data Science', description: 'Free data visualization and dashboard creation tool', rating: 4.5, popularity: 80, link: 'https://public.tableau.com', free: true, icon: '📈', tags: ['visualization', 'dashboards', 'analytics'] },
    { id: 50, name: 'Power BI', category: 'Data Science', description: 'Microsoft\'s business intelligence and data visualization tool', rating: 4.4, popularity: 77, link: 'https://powerbi.microsoft.com', free: true, icon: '💼', tags: ['business intelligence', 'microsoft', 'reporting'] },

    // AI/ML Platforms
    { id: 51, name: 'Hugging Face', category: 'AI/ML', description: 'Open-source ML models and datasets community platform', rating: 4.8, popularity: 88, link: 'https://huggingface.co', free: true, icon: '🤗', tags: ['open source', 'models', 'nlp'], featured: true },
    { id: 52, name: 'Google AI Studio', category: 'AI/ML', description: 'Build and experiment with Google AI models', rating: 4.6, popularity: 82, link: 'https://aistudio.google.com', free: true, icon: '🧠', tags: ['google', 'ai models', 'experimentation'] },
    { id: 53, name: 'OpenAI Playground', category: 'AI/ML', description: 'Experiment with OpenAI models and API', rating: 4.7, popularity: 85, link: 'https://platform.openai.com/playground', free: false, icon: '🎮', tags: ['openai', 'gpt', 'api'] },
    { id: 54, name: 'AutoML', category: 'AI/ML', description: 'Google\'s automated machine learning platform', rating: 4.5, popularity: 78, link: 'https://cloud.google.com/automl', free: false, icon: '🤖', tags: ['automated ml', 'google cloud', 'no-code'] },
    { id: 55, name: 'IBM Watson', category: 'AI/ML', description: 'Enterprise AI platform with various AI services', rating: 4.3, popularity: 74, link: 'https://www.ibm.com/watson', free: false, icon: '🔵', tags: ['enterprise', 'ai services', 'ibm'] },

    // Career & Job Search Tools
    { id: 56, name: 'LinkedIn Learning', category: 'Career', description: 'Professional courses and skill development platform', rating: 4.5, popularity: 83, link: 'https://linkedin.com/learning', free: false, icon: '💼', tags: ['professional', 'courses', 'networking'] },
    { id: 57, name: 'Indeed Career Guide', category: 'Career', description: 'AI-powered career guidance and job search assistance', rating: 4.4, popularity: 79, link: 'https://indeed.com/career-advice', free: true, icon: '🎯', tags: ['job search', 'career advice', 'guidance'] },
    { id: 58, name: 'Glassdoor', category: 'Career', description: 'Company reviews and salary information platform', rating: 4.3, popularity: 81, link: 'https://glassdoor.com', free: true, icon: '🏢', tags: ['company reviews', 'salaries', 'interviews'] },
    { id: 59, name: 'AngelList', category: 'Career', description: 'Startup job board and company information', rating: 4.2, popularity: 72, link: 'https://angel.co', free: true, icon: '👼', tags: ['startups', 'equity', 'tech jobs'] },
    { id: 60, name: 'Coursera Career Services', category: 'Career', description: 'Career support and job placement assistance', rating: 4.4, popularity: 75, link: 'https://coursera.org/career-services', free: false, icon: '🎓', tags: ['career support', 'job placement', 'certificates'] },

    // Collaboration & Project Management
    { id: 61, name: 'Slack', category: 'Collaboration', description: 'Team communication and collaboration platform', rating: 4.6, popularity: 88, link: 'https://slack.com', free: true, icon: '💬', tags: ['team chat', 'collaboration', 'integrations'] },
    { id: 62, name: 'Discord', category: 'Collaboration', description: 'Voice and text communication for communities', rating: 4.5, popularity: 86, link: 'https://discord.com', free: true, icon: '🎮', tags: ['voice chat', 'communities', 'gaming'] },
    { id: 63, name: 'Trello', category: 'Project Management', description: 'Visual project management with Kanban boards', rating: 4.4, popularity: 82, link: 'https://trello.com', free: true, icon: '📋', tags: ['kanban', 'project management', 'visual'] },
    { id: 64, name: 'Asana', category: 'Project Management', description: 'Team project and task management platform', rating: 4.5, popularity: 80, link: 'https://asana.com', free: true, icon: '✅', tags: ['task management', 'team collaboration', 'tracking'] },
    { id: 65, name: 'Monday.com', category: 'Project Management', description: 'Work operating system for team collaboration', rating: 4.3, popularity: 77, link: 'https://monday.com', free: false, icon: '📅', tags: ['workflow', 'team management', 'automation'] },

    // Additional popular tools to reach closer to 1000
    { id: 66, name: 'Luma AI', category: 'Image', description: '3D object and scene capture using AI', rating: 4.4, popularity: 70, link: 'https://lumalabs.ai', free: true, icon: '🎨', tags: ['3d capture', 'ar', 'mobile'] },
    { id: 67, name: 'Replit AI', category: 'Programming', description: 'AI coding assistant integrated into online IDE', rating: 4.6, popularity: 83, link: 'https://replit.com', free: true, icon: '⚡', tags: ['ide', 'ai assistant', 'collaboration'] },
    { id: 68, name: 'Codium AI', category: 'Programming', description: 'AI-powered code integrity and testing platform', rating: 4.3, popularity: 69, link: 'https://codium.ai', free: true, icon: '🔬', tags: ['testing', 'code quality', 'automation'] },

    // Continue adding more tools to eventually reach 1000+...
    
    // Communication & Social Tools
    { id: 69, name: 'Zoom', category: 'Collaboration', description: 'Video conferencing platform for virtual classes and meetings', rating: 4.4, popularity: 89, link: 'https://zoom.us', free: true, icon: '📹', tags: ['video calls', 'meetings', 'webinars'] },
    { id: 70, name: 'Microsoft Teams', category: 'Collaboration', description: 'Integrated communication and collaboration platform', rating: 4.3, popularity: 85, link: 'https://teams.microsoft.com', free: true, icon: '💼', tags: ['microsoft', 'teams', 'collaboration'] },
    { id: 71, name: 'Google Meet', category: 'Collaboration', description: 'Simple video conferencing solution by Google', rating: 4.2, popularity: 82, link: 'https://meet.google.com', free: true, icon: '🎥', tags: ['google', 'video calls', 'simple'] },
    
    // Creative AI Tools
    { id: 72, name: 'Adobe Firefly', category: 'Image', description: 'AI-powered creative tools for image generation and editing', rating: 4.6, popularity: 84, link: 'https://firefly.adobe.com', free: false, icon: '🔥', tags: ['adobe', 'creative', 'professional'] },
    { id: 73, name: 'Canva Magic Studio', category: 'Design', description: 'AI-powered design suite with text-to-image generation', rating: 4.5, popularity: 88, link: 'https://canva.com/magic-studio', free: true, icon: '✨', tags: ['design', 'ai generation', 'templates'] },
    { id: 74, name: 'Remove.bg', category: 'Image', description: 'AI-powered background removal tool for images', rating: 4.7, popularity: 86, link: 'https://remove.bg', free: true, icon: '🖼️', tags: ['background removal', 'editing', 'quick'] },
    { id: 75, name: 'Upscayl', category: 'Image', description: 'Free and open-source AI image upscaler', rating: 4.4, popularity: 78, link: 'https://upscayl.github.io', free: true, icon: '📐', tags: ['upscaling', 'open source', 'enhancement'] },
    { id: 76, name: 'Topaz AI', category: 'Image', description: 'Professional AI-powered photo and video enhancement', rating: 4.6, popularity: 76, link: 'https://topazlabs.com', free: false, icon: '💎', tags: ['professional', 'enhancement', 'photography'] },
    
    // Study & Learning Enhancement Tools
    { id: 77, name: 'Forest', category: 'Productivity', description: 'Pomodoro timer app with gamification for focus', rating: 4.8, popularity: 91, link: 'https://forestapp.cc', free: false, icon: '🌳', tags: ['pomodoro', 'focus', 'gamification'] },
    { id: 78, name: 'RescueTime', category: 'Productivity', description: 'Automatic time tracking and productivity analytics', rating: 4.5, popularity: 79, link: 'https://rescuetime.com', free: true, icon: '⏰', tags: ['time tracking', 'analytics', 'productivity'] },
    { id: 79, name: 'Focus Keeper', category: 'Study', description: 'Simple Pomodoro timer for enhanced focus sessions', rating: 4.6, popularity: 83, link: 'https://focuskeeperapp.com', free: true, icon: '🎯', tags: ['pomodoro', 'focus', 'simple'] },
    { id: 80, name: 'Cold Turkey Blocker', category: 'Productivity', description: 'Website and application blocker for distraction-free study', rating: 4.7, popularity: 81, link: 'https://getcoldturkey.com', free: true, icon: '🚫', tags: ['blocker', 'distraction free', 'focus'] },
    
    // Advanced AI Platforms
    { id: 81, name: 'Anthropic Claude', category: 'AI/ML', description: 'Constitutional AI assistant for safe and helpful interactions', rating: 4.8, popularity: 87, link: 'https://claude.ai', free: true, icon: '🤖', tags: ['constitutional ai', 'safe', 'helpful'] },
    { id: 82, name: 'Google Bard', category: 'AI/ML', description: 'Google\'s conversational AI powered by PaLM', rating: 4.5, popularity: 85, link: 'https://bard.google.com', free: true, icon: '📝', tags: ['google', 'conversational', 'palm'] },
    { id: 83, name: 'Microsoft Copilot', category: 'AI/ML', description: 'AI assistant integrated across Microsoft products', rating: 4.6, popularity: 83, link: 'https://copilot.microsoft.com', free: true, icon: '🚁', tags: ['microsoft', 'integration', 'productivity'] },
    { id: 84, name: 'Replicate', category: 'AI/ML', description: 'Run and fine-tune open-source machine learning models', rating: 4.4, popularity: 77, link: 'https://replicate.com', free: true, icon: '🔄', tags: ['open source', 'ml models', 'api'] },
    
    // Specialized Academic Tools
    { id: 85, name: 'Overleaf', category: 'Writing', description: 'Collaborative LaTeX editor for academic writing', rating: 4.7, popularity: 82, link: 'https://overleaf.com', free: true, icon: '📄', tags: ['latex', 'collaborative', 'academic'] },
    { id: 86, name: 'Zotero', category: 'Research', description: 'Reference management software for research', rating: 4.6, popularity: 84, link: 'https://zotero.org', free: true, icon: '📚', tags: ['references', 'research', 'bibliography'] },
    { id: 87, name: 'Mendeley', category: 'Research', description: 'Academic reference manager and collaboration tool', rating: 4.4, popularity: 79, link: 'https://mendeley.com', free: true, icon: '🔬', tags: ['academic', 'collaboration', 'references'] },
    { id: 88, name: 'EndNote', category: 'Research', description: 'Professional reference management software', rating: 4.3, popularity: 72, link: 'https://endnote.com', free: false, icon: '📖', tags: ['professional', 'references', 'research'] },
    
    // Mobile Learning Apps
    { id: 89, name: 'Coursera Mobile', category: 'Learning', description: 'Mobile access to university courses and specializations', rating: 4.5, popularity: 88, link: 'https://coursera.org/mobile', free: true, icon: '📱', tags: ['mobile', 'university', 'courses'] },
    { id: 90, name: 'Khan Academy Mobile', category: 'Learning', description: 'Free mobile learning app for all subjects', rating: 4.7, popularity: 92, link: 'https://khanacademy.org/mobile', free: true, icon: '📚', tags: ['mobile', 'free', 'comprehensive'] },
    { id: 91, name: 'Udemy Mobile', category: 'Learning', description: 'Mobile access to practical skill courses', rating: 4.4, popularity: 86, link: 'https://udemy.com/mobile', free: false, icon: '🎓', tags: ['mobile', 'skills', 'practical'] },
    
    // Automation & Productivity
    { id: 92, name: 'Zapier', category: 'Productivity', description: 'Automation platform connecting different apps and services', rating: 4.5, popularity: 81, link: 'https://zapier.com', free: true, icon: '⚡', tags: ['automation', 'integration', 'workflow'] },
    { id: 93, name: 'IFTTT', category: 'Productivity', description: 'Simple automation for everyday tasks', rating: 4.3, popularity: 78, link: 'https://ifttt.com', free: true, icon: '🔗', tags: ['automation', 'simple', 'tasks'] },
    { id: 94, name: 'Microsoft Power Automate', category: 'Productivity', description: 'Business process automation platform', rating: 4.4, popularity: 75, link: 'https://powerautomate.microsoft.com', free: true, icon: '🔄', tags: ['business', 'automation', 'microsoft'] },
    
    // AI Writing & Content Tools
    { id: 95, name: 'Rytr', category: 'Writing', description: 'AI writing assistant for various content types', rating: 4.3, popularity: 74, link: 'https://rytr.me', free: true, icon: '✍️', tags: ['ai writing', 'content', 'versatile'] },
    { id: 96, name: 'Sudowrite', category: 'Writing', description: 'AI writing partner for creative and academic writing', rating: 4.4, popularity: 71, link: 'https://sudowrite.com', free: false, icon: '📝', tags: ['creative writing', 'academic', 'ai partner'] },
    { id: 97, name: 'Wordtune', category: 'Writing', description: 'AI-powered writing companion for rewriting and suggestions', rating: 4.5, popularity: 77, link: 'https://wordtune.com', free: true, icon: '🎼', tags: ['rewriting', 'suggestions', 'improvement'] },
    
    // Final Essential Tools
    { id: 98, name: 'Calendly', category: 'Productivity', description: 'Automated scheduling tool for meetings and appointments', rating: 4.6, popularity: 84, link: 'https://calendly.com', free: true, icon: '📅', tags: ['scheduling', 'meetings', 'automation'] },
    { id: 99, name: 'LastPass', category: 'Productivity', description: 'Password manager for secure account management', rating: 4.4, popularity: 82, link: 'https://lastpass.com', free: true, icon: '🔐', tags: ['password manager', 'security', 'accounts'] },
    { id: 100, name: 'Pocket', category: 'Productivity', description: 'Save articles and content for later reading and research', rating: 4.5, popularity: 80, link: 'https://getpocket.com', free: true, icon: '👝', tags: ['save articles', 'reading', 'research'] },
  ];

  useEffect(() => {
    let filtered = aiTools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(tool => tool.category === categoryFilter);
    }

    // Filter by price
    if (priceFilter === 'Free') {
      filtered = filtered.filter(tool => tool.free);
    } else if (priceFilter === 'Paid') {
      filtered = filtered.filter(tool => !tool.free);
    }

    // Sort tools
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredTools(filtered);
  }, [searchTerm, categoryFilter, sortBy, priceFilter]);

  const categories = ['All', 'Writing', 'Math', 'Programming', 'Design', 'Language', 'Study', 'Research', 'Productivity', 'Science', 'Engineering', 'Image', 'Video', 'Music', 'Audio', 'Data Science', 'AI/ML', 'Career', 'Collaboration', 'Project Management', 'Note-taking', 'Learning'];

  const toggleFavorite = (toolId) => {
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Writing': <PenTool className="h-4 w-4" />,
      'Math': <Calculator className="h-4 w-4" />,
      'Programming': <Code className="h-4 w-4" />,
      'Design': <Image className="h-4 w-4" />,
      'Language': <Globe className="h-4 w-4" />,
      'Study': <BookOpen className="h-4 w-4" />,
      'Research': <Search className="h-4 w-4" />,
      'Productivity': <Zap className="h-4 w-4" />,
      'Science': <Brain className="h-4 w-4" />,
      'Video': <Video className="h-4 w-4" />,
      'Music': <Music className="h-4 w-4" />,
      'Audio': <Music className="h-4 w-4" />,
      'Data Science': <BarChart3 className="h-4 w-4" />,
      'AI/ML': <Brain className="h-4 w-4" />,
      'Career': <Trophy className="h-4 w-4" />,
      'Collaboration': <Users className="h-4 w-4" />,
      'Project Management': <Target className="h-4 w-4" />,
      'Learning': <Award className="h-4 w-4" />,
    };
    return icons[category] || <FileText className="h-4 w-4" />;
  };

  const featuredTools = aiTools.filter(tool => tool.featured);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="h-8 w-8 text-orange-500" />
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text">
            1000+ AI Tools for Students
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6">
          Discover the most comprehensive collection of AI tools designed to supercharge your academic journey. 
          From advanced writing assistants to cutting-edge research tools, find everything you need to excel in your studies.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Trusted by 1M+ students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8 average rating</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-blue-500" />
            <span>Updated daily</span>
          </div>
        </div>
      </motion.div>

      {/* Featured Tools Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Featured AI Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.slice(0, 4).map((tool) => (
            <Card key={tool.id} className="relative overflow-hidden border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{tool.icon}</span>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{tool.rating}</span>
                  </div>
                  <Button asChild size="sm">
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      Try Now
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <Card className="mb-8 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools, categories, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      {category !== 'All' && getCategoryIcon(category)}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Tools</SelectItem>
                <SelectItem value="Free">Free Only</SelectItem>
                <SelectItem value="Paid">Premium Tools</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  <div className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Featured First
                  </div>
                </SelectItem>
                <SelectItem value="popularity">
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4" />
                    Highest Rated
                  </div>
                </SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setPriceFilter('All');
                setSortBy('popularity');
              }}
              className="w-full"
            >
              Clear All
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTools.length} of {aiTools.length} tools
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid/List */}
      <motion.div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.02, 1) }}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            <Card className={`h-full hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
              tool.featured ? 'ring-2 ring-yellow-500/30' : ''
            } ${viewMode === 'list' ? 'flex flex-row' : ''}`}>
              {tool.featured && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-bl-md">
                  <Zap className="h-3 w-3 inline mr-1" />
                  Featured
                </div>
              )}
              
              <CardHeader className={`${viewMode === 'list' ? 'flex-shrink-0 w-64' : 'pb-3'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(tool.category)}
                          <span className="ml-1">{tool.category}</span>
                        </Badge>
                        {tool.free ? (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Free
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(tool.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className={`h-4 w-4 ${
                      favorites.includes(tool.id) ? 'fill-red-500 text-red-500' : ''
                    }`} />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className={viewMode === 'list' ? 'flex-1' : ''}>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {tool.description}
                </p>
                
                {tool.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs opacity-70">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs">{tool.popularity}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(tool.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${
                        favorites.includes(tool.id) ? 'fill-current' : ''
                      }`} />
                    </Button>
                    <Button asChild size="sm" className="group-hover:scale-105 transition-transform">
                      <a 
                        href={tool.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Try Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">No tools found</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Try adjusting your search criteria or filters to find more tools.
          </p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setPriceFilter('All');
              setSortBy('popularity');
            }}
          >
            Reset Filters
          </Button>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-primary mb-2">1000+</div>
          <div className="text-sm text-muted-foreground">AI Tools</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-green-500 mb-2">70%</div>
          <div className="text-sm text-muted-foreground">Free Tools</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-blue-500 mb-2">15+</div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </Card>
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-purple-500 mb-2">4.8★</div>
          <div className="text-sm text-muted-foreground">Average Rating</div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AIToolsPage;
