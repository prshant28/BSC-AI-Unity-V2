import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ExternalLink,
  Star,
  Users,
  Flame,
  Brain,
  Code,
  FileText,
  Image,
  Video,
  Mic,
  BookOpen,
  Calculator,
  Globe,
  Mail,
  MessageSquare,
  Palette,
  Camera,
  Award,
  Target,
  Zap,
  Sparkles,
  Rocket,
  Shield,
  Clock,
  Database,
  BarChart,
  TrendingUp,
  PieChart,
  LineChart,
  Edit,
  Scissors,
  Layers,
  Crop,
  Filter,
  Brush,
  Type,
  Layout,
  Grid,
  Smartphone,
  Monitor,
  Tablet,
  Headphones,
  Play,
  Pause,
  VolumeX,
  Volume2,
  Settings,
  Tools,
  Wrench,
  Hammer,
  Lightbulb,
  Cloud,
  Download,
  Upload,
  Share,
  Link,
  Copy,
  Save,
  Folder,
  File,
  Archive,
  Package,
  Box,
  Gift,
  Heart,
  ThumbsUp,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  User,
  UserPlus,
  Users2,
  UserCheck,
  Crown,
  Map,
  MapPin,
  Navigation,
  Compass,
  Calendar,
  Timer,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RefreshCw,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
} from "lucide-react";

const AIToolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const aiTools = [
    // Writing & Content Creation (20 tools)
    { name: "ChatGPT", category: "Writing", description: "Advanced conversational AI for writing and research", rating: 4.8, users: "100M+", featured: true, link: "https://chat.openai.com" },
    { name: "Claude", category: "Writing", description: "Anthropic's AI assistant for thoughtful conversations", rating: 4.7, users: "10M+", featured: true, link: "https://claude.ai" },
    { name: "Jasper AI", category: "Writing", description: "AI copilot for enterprise marketing teams", rating: 4.5, users: "1M+", featured: false, link: "https://jasper.ai" },
    { name: "Copy.ai", category: "Writing", description: "AI-powered copywriting for marketing teams", rating: 4.4, users: "500K+", featured: false, link: "https://copy.ai" },
    { name: "Grammarly", category: "Writing", description: "AI writing assistant for grammar and style", rating: 4.6, users: "30M+", featured: true, link: "https://grammarly.com" },
    { name: "Notion AI", category: "Writing", description: "AI-powered writing assistant in Notion", rating: 4.3, users: "5M+", featured: false, link: "https://notion.so" },
    { name: "Writesonic", category: "Writing", description: "AI writer for articles, blogs, and ads", rating: 4.2, users: "300K+", featured: false, link: "https://writesonic.com" },
    { name: "QuillBot", category: "Writing", description: "AI paraphrasing and writing tool", rating: 4.4, users: "2M+", featured: false, link: "https://quillbot.com" },
    { name: "Rytr", category: "Writing", description: "AI writing assistant for content creation", rating: 4.1, users: "200K+", featured: false, link: "https://rytr.me" },
    { name: "Wordtune", category: "Writing", description: "AI writing companion for rewriting", rating: 4.3, users: "1M+", featured: false, link: "https://wordtune.com" },
    { name: "Shortly AI", category: "Writing", description: "AI writing partner for creative content", rating: 4.0, users: "100K+", featured: false, link: "https://shortlyai.com" },
    { name: "INK", category: "Writing", description: "AI content optimizer for SEO", rating: 4.2, users: "150K+", featured: false, link: "https://inkforall.com" },
    { name: "Anyword", category: "Writing", description: "AI copywriting for performance marketing", rating: 4.1, users: "80K+", featured: false, link: "https://anyword.com" },
    { name: "Peppertype", category: "Writing", description: "AI content assistant for teams", rating: 4.0, users: "50K+", featured: false, link: "https://peppertype.ai" },
    { name: "Article Forge", category: "Writing", description: "AI article generator", rating: 3.9, users: "40K+", featured: false, link: "https://articleforge.com" },
    { name: "Copysmith", category: "Writing", description: "AI content creation platform", rating: 4.1, users: "60K+", featured: false, link: "https://copysmith.ai" },
    { name: "ContentBot", category: "Writing", description: "AI writer for blog content", rating: 3.8, users: "30K+", featured: false, link: "https://contentbot.ai" },
    { name: "Simplified", category: "Writing", description: "All-in-one AI content creation", rating: 4.2, users: "200K+", featured: false, link: "https://simplified.com" },
    { name: "Surfer SEO", category: "Writing", description: "AI content optimization for SEO", rating: 4.5, users: "150K+", featured: false, link: "https://surferseo.com" },
    { name: "Frase", category: "Writing", description: "AI-powered content research and optimization", rating: 4.3, users: "80K+", featured: false, link: "https://frase.io" },

    // Coding & Development (15 tools)
    { name: "GitHub Copilot", category: "Coding", description: "AI pair programmer for code completion", rating: 4.7, users: "5M+", featured: true, link: "https://github.com/features/copilot" },
    { name: "Replit Ghostwriter", category: "Coding", description: "AI coding assistant in Replit", rating: 4.5, users: "1M+", featured: true, link: "https://replit.com" },
    { name: "CodeT5", category: "Coding", description: "AI model for code understanding and generation", rating: 4.3, users: "500K+", featured: false, link: "https://huggingface.co/Salesforce/codet5-base" },
    { name: "Tabnine", category: "Coding", description: "AI code completion for all languages", rating: 4.4, users: "2M+", featured: false, link: "https://tabnine.com" },
    { name: "Kite", category: "Coding", description: "AI-powered coding assistant", rating: 4.0, users: "300K+", featured: false, link: "https://kite.com" },
    { name: "DeepCode", category: "Coding", description: "AI code review and analysis", rating: 4.2, users: "200K+", featured: false, link: "https://snyk.io/platform/deepcode-ai" },
    { name: "Sourcery", category: "Coding", description: "AI code reviewer for Python", rating: 4.1, users: "100K+", featured: false, link: "https://sourcery.ai" },
    { name: "CodeGuru", category: "Coding", description: "Amazon's AI code reviewer", rating: 4.3, users: "150K+", featured: false, link: "https://aws.amazon.com/codeguru" },
    { name: "IntelliCode", category: "Coding", description: "Microsoft's AI coding assistance", rating: 4.2, users: "2M+", featured: false, link: "https://visualstudio.microsoft.com/services/intellicode" },
    { name: "Codex", category: "Coding", description: "OpenAI's code generation model", rating: 4.6, users: "1M+", featured: false, link: "https://openai.com/blog/openai-codex" },
    { name: "AI Code Translator", category: "Coding", description: "Translate code between languages", rating: 3.9, users: "50K+", featured: false, link: "https://ai-code-translator.vercel.app" },
    { name: "CodeWP", category: "Coding", description: "AI code generator for WordPress", rating: 4.0, users: "30K+", featured: false, link: "https://codewp.ai" },
    { name: "Stenography", category: "Coding", description: "AI documentation for code", rating: 3.8, users: "25K+", featured: false, link: "https://stenography.dev" },
    { name: "Blackbox AI", category: "Coding", description: "AI coding assistant", rating: 4.1, users: "200K+", featured: false, link: "https://blackbox.ai" },
    { name: "Codeium", category: "Coding", description: "Free AI-powered code completion", rating: 4.4, users: "300K+", featured: false, link: "https://codeium.com" },

    // Image & Design (15 tools)
    { name: "Midjourney", category: "Image", description: "AI art generator for creative images", rating: 4.8, users: "15M+", featured: true, link: "https://midjourney.com" },
    { name: "DALL-E 2", category: "Image", description: "OpenAI's image generation from text", rating: 4.7, users: "10M+", featured: true, link: "https://openai.com/dall-e-2" },
    { name: "Stable Diffusion", category: "Image", description: "Open-source AI image generator", rating: 4.6, users: "8M+", featured: true, link: "https://stability.ai" },
    { name: "Canva AI", category: "Image", description: "AI design assistant in Canva", rating: 4.5, users: "20M+", featured: true, link: "https://canva.com" },
    { name: "Adobe Firefly", category: "Image", description: "Adobe's AI creative suite", rating: 4.4, users: "5M+", featured: false, link: "https://firefly.adobe.com" },
    { name: "Figma AI", category: "Image", description: "AI design tools in Figma", rating: 4.3, users: "3M+", featured: false, link: "https://figma.com" },
    { name: "Runway ML", category: "Image", description: "AI tools for creative projects", rating: 4.5, users: "2M+", featured: false, link: "https://runwayml.com" },
    { name: "Leonardo AI", category: "Image", description: "AI art generation platform", rating: 4.2, users: "1M+", featured: false, link: "https://leonardo.ai" },
    { name: "Artbreeder", category: "Image", description: "Collaborative AI art creation", rating: 4.0, users: "500K+", featured: false, link: "https://artbreeder.com" },
    { name: "DeepArt", category: "Image", description: "AI style transfer for images", rating: 3.9, users: "300K+", featured: false, link: "https://deepart.io" },
    { name: "NightCafe", category: "Image", description: "AI art generator community", rating: 4.1, users: "800K+", featured: false, link: "https://nightcafe.studio" },
    { name: "Photosonic", category: "Image", description: "AI image generator by Writesonic", rating: 4.0, users: "400K+", featured: false, link: "https://photosonic.writesonic.com" },
    { name: "Dream by WOMBO", category: "Image", description: "AI art creation app", rating: 3.8, users: "600K+", featured: false, link: "https://dream.ai" },
    { name: "StarryAI", category: "Image", description: "AI art generator app", rating: 3.7, users: "200K+", featured: false, link: "https://starryai.com" },
    { name: "Craiyon", category: "Image", description: "Free AI image generator", rating: 3.6, users: "1M+", featured: false, link: "https://craiyon.com" },

    // Research & Analysis (15 tools)
    { name: "Perplexity AI", category: "Research", description: "AI-powered search and research", rating: 4.6, users: "5M+", featured: true, link: "https://perplexity.ai" },
    { name: "Elicit", category: "Research", description: "AI research assistant for papers", rating: 4.4, users: "200K+", featured: false, link: "https://elicit.org" },
    { name: "Semantic Scholar", category: "Research", description: "AI-powered academic search", rating: 4.5, users: "1M+", featured: false, link: "https://semanticscholar.org" },
    { name: "Consensus", category: "Research", description: "AI search engine for research", rating: 4.3, users: "100K+", featured: false, link: "https://consensus.app" },
    { name: "ResearchGate AI", category: "Research", description: "AI tools for researchers", rating: 4.2, users: "500K+", featured: false, link: "https://researchgate.net" },
    { name: "Scholarcy", category: "Research", description: "AI research summarization", rating: 4.1, users: "80K+", featured: false, link: "https://scholarcy.com" },
    { name: "SciSpace", category: "Research", description: "AI copilot for research papers", rating: 4.0, users: "150K+", featured: false, link: "https://scispace.com" },
    { name: "Iris.ai", category: "Research", description: "AI research workspace", rating: 3.9, users: "50K+", featured: false, link: "https://iris.ai" },
    { name: "Connected Papers", category: "Research", description: "Visual tool for academic papers", rating: 4.2, users: "300K+", featured: false, link: "https://connectedpapers.com" },
    { name: "Litmaps", category: "Research", description: "Literature mapping tool", rating: 3.8, users: "40K+", featured: false, link: "https://litmaps.com" },
    { name: "Zeta Alpha", category: "Research", description: "AI research discovery platform", rating: 4.0, users: "30K+", featured: false, link: "https://zetaalpha.com" },
    { name: "Scite", category: "Research", description: "AI-powered citation analysis", rating: 4.1, users: "60K+", featured: false, link: "https://scite.ai" },
    { name: "Research Rabbit", category: "Research", description: "AI research discovery tool", rating: 3.9, users: "25K+", featured: false, link: "https://researchrabbitapp.com" },
    { name: "Inciteful", category: "Research", description: "Academic paper network analysis", rating: 3.7, users: "20K+", featured: false, link: "https://inciteful.xyz" },
    { name: "OpenRead", category: "Research", description: "AI-enhanced paper reading", rating: 3.8, users: "35K+", featured: false, link: "https://openread.academy" },

    // Video & Audio (10 tools)
    { name: "Synthesia", category: "Video", description: "AI video generation with avatars", rating: 4.4, users: "500K+", featured: true, link: "https://synthesia.io" },
    { name: "Descript", category: "Video", description: "AI video and podcast editing", rating: 4.5, users: "300K+", featured: false, link: "https://descript.com" },
    { name: "Murf", category: "Audio", description: "AI voice generation for content", rating: 4.3, users: "200K+", featured: false, link: "https://murf.ai" },
    { name: "ElevenLabs", category: "Audio", description: "AI voice cloning and synthesis", rating: 4.6, users: "1M+", featured: true, link: "https://elevenlabs.io" },
    { name: "Pictory", category: "Video", description: "AI video creation from text", rating: 4.2, users: "150K+", featured: false, link: "https://pictory.ai" },
    { name: "Loom AI", category: "Video", description: "AI-powered video messaging", rating: 4.1, users: "800K+", featured: false, link: "https://loom.com" },
    { name: "Otter.ai", category: "Audio", description: "AI meeting transcription", rating: 4.4, users: "2M+", featured: false, link: "https://otter.ai" },
    { name: "Whisper", category: "Audio", description: "OpenAI's speech recognition", rating: 4.5, users: "1M+", featured: false, link: "https://openai.com/research/whisper" },
    { name: "Podcastle", category: "Audio", description: "AI podcast creation platform", rating: 4.0, users: "100K+", featured: false, link: "https://podcastle.ai" },
    { name: "Cleanvoice", category: "Audio", description: "AI audio editing and cleanup", rating: 3.9, users: "50K+", featured: false, link: "https://cleanvoice.ai" },

    // Learning & Education (10 tools)
    { name: "Khan Academy AI", category: "Learning", description: "Personalized AI tutoring", rating: 4.7, users: "10M+", featured: true, link: "https://khanacademy.org" },
    { name: "Socratic by Google", category: "Learning", description: "AI homework help", rating: 4.3, users: "5M+", featured: false, link: "https://socratic.org" },
    { name: "Coursera AI", category: "Learning", description: "AI-powered course recommendations", rating: 4.2, users: "8M+", featured: false, link: "https://coursera.org" },
    { name: "Duolingo AI", category: "Learning", description: "AI language learning assistant", rating: 4.5, users: "20M+", featured: true, link: "https://duolingo.com" },
    { name: "Squirrel AI", category: "Learning", description: "Adaptive AI tutoring system", rating: 4.1, users: "1M+", featured: false, link: "https://squirrelai.com" },
    { name: "Carnegie Learning", category: "Learning", description: "AI-powered math learning", rating: 4.0, users: "500K+", featured: false, link: "https://carnegielearning.com" },
    { name: "Century Tech", category: "Learning", description: "AI learning platform", rating: 3.9, users: "300K+", featured: false, link: "https://century.tech" },
    { name: "Knewton", category: "Learning", description: "Adaptive learning technology", rating: 3.8, users: "200K+", featured: false, link: "https://knewton.com" },
    { name: "ALEKS", category: "Learning", description: "AI-based assessment and learning", rating: 4.0, users: "400K+", featured: false, link: "https://aleks.com" },
    { name: "Gradescope", category: "Learning", description: "AI-assisted grading", rating: 4.2, users: "600K+", featured: false, link: "https://gradescope.com" },

    // Data & Analytics (10 tools)
    { name: "DataRobot", category: "Analytics", description: "Automated machine learning platform", rating: 4.3, users: "100K+", featured: false, link: "https://datarobot.com" },
    { name: "H2O.ai", category: "Analytics", description: "Open source machine learning", rating: 4.2, users: "200K+", featured: false, link: "https://h2o.ai" },
    { name: "Tableau AI", category: "Analytics", description: "AI-powered data visualization", rating: 4.4, users: "1M+", featured: true, link: "https://tableau.com" },
    { name: "MonkeyLearn", category: "Analytics", description: "No-code text analysis with AI", rating: 4.0, users: "50K+", featured: false, link: "https://monkeylearn.com" },
    { name: "Zapier AI", category: "Analytics", description: "AI workflow automation", rating: 4.1, users: "2M+", featured: false, link: "https://zapier.com" },
    { name: "Obviously AI", category: "Analytics", description: "No-code predictive analytics", rating: 3.9, users: "30K+", featured: false, link: "https://obviously.ai" },
    { name: "Pecan AI", category: "Analytics", description: "Predictive analytics platform", rating: 3.8, users: "20K+", featured: false, link: "https://pecan.ai" },
    { name: "Dataiku", category: "Analytics", description: "Data science platform", rating: 4.2, users: "80K+", featured: false, link: "https://dataiku.com" },
    { name: "Alteryx", category: "Analytics", description: "Self-service data analytics", rating: 4.1, users: "150K+", featured: false, link: "https://alteryx.com" },
    { name: "Databricks", category: "Analytics", description: "Unified analytics platform", rating: 4.3, users: "300K+", featured: false, link: "https://databricks.com" },

    // Productivity & Business (5 tools)
    { name: "Notion AI", category: "Productivity", description: "AI-powered workspace", rating: 4.3, users: "5M+", featured: true, link: "https://notion.so" },
    { name: "Calendly AI", category: "Productivity", description: "AI scheduling assistant", rating: 4.2, users: "2M+", featured: false, link: "https://calendly.com" },
    { name: "Superhuman AI", category: "Productivity", description: "AI email management", rating: 4.4, users: "100K+", featured: false, link: "https://superhuman.com" },
    { name: "Reclaim AI", category: "Productivity", description: "AI calendar optimization", rating: 4.1, users: "80K+", featured: false, link: "https://reclaim.ai" },
    { name: "Motion", category: "Productivity", description: "AI project management", rating: 4.0, users: "60K+", featured: false, link: "https://usemotion.com" }
  ];

  const categories = ["All", "Writing", "Coding", "Image", "Research", "Video", "Audio", "Learning", "Analytics", "Productivity"];

  const filteredTools = useMemo(() => {
    return aiTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Writing': <FileText className="h-4 w-4" />,
      'Coding': <Code className="h-4 w-4" />,
      'Image': <Image className="h-4 w-4" />,
      'Research': <BookOpen className="h-4 w-4" />,
      'Video': <Video className="h-4 w-4" />,
      'Audio': <Mic className="h-4 w-4" />,
      'Analytics': <BarChart className="h-4 w-4" />,
      'Productivity': <Target className="h-4 w-4" />,
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
            100+ AI Tools for Students
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

      {/* Featured Tools */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          Featured Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(tool.category)}
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                      Featured
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{tool.users}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <Button asChild size="sm" className="w-full group">
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      Try Now
                      <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center gap-1"
              >
                {category !== "All" && getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* All Tools Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold mb-6">
          All Tools ({filteredTools.length})
        </h2>
        {filteredTools.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(tool.category)}
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                      {tool.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{tool.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{tool.users}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs w-fit">
                      {tool.category}
                    </Badge>
                    <Button asChild size="sm" className="w-full group">
                      <a href={tool.link} target="_blank" rel="noopener noreferrer">
                        Try Now
                        <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-center"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Ready to Supercharge Your Learning?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of students who are already using AI tools to accelerate their academic success. 
              Start exploring these powerful tools today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Get Started Now
                <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Join Our Community
                <Users className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AIToolsPage;