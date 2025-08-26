import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import ConcernCard from "@/components/ConcernCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Plus,
  RefreshCw,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ConcernsPage = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });
  const { toast } = useToast();

  const fetchConcerns = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("concerns")
        .select(`
          *,
          concern_replies(*)
        `);

      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("created_at", { ascending: true });
          break;
        case "most_helpful":
          query = query.order("helpful_votes", { ascending: false });
          break;
        case "most_replies":
          // This would need to be done client-side or with a view
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process data to include reply counts
      const processedData = data.map(concern => ({
        ...concern,
        replies: concern.concern_replies || [],
        reply_count: concern.concern_replies?.length || 0,
      }));

      // Sort by reply count if needed (client-side)
      if (sortBy === "most_replies") {
        processedData.sort((a, b) => b.reply_count - a.reply_count);
      }

      setConcerns(processedData);

      // Calculate stats
      const total = processedData.length;
      const resolved = processedData.filter(c => c.status?.toLowerCase() === "resolved").length;
      const pending = processedData.filter(c => c.status?.toLowerCase() === "pending").length;
      const inProgress = processedData.filter(c => c.status?.toLowerCase() === "in progress").length;

      setStats({ total, resolved, pending, inProgress });
    } catch (error) {
      console.error("Error fetching concerns:", error);
      toast({
        title: "Error",
        description: "Failed to fetch concerns: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcerns();
  }, [sortBy]);

  const handleRefresh = () => {
    fetchConcerns();
    toast({
      title: "Refreshed",
      description: "Concerns list has been updated.",
    });
  };

  const filteredConcerns = concerns.filter((concern) => {
    const matchesSearch = 
      concern.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concern.student_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || concern.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || concern.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ["All", "Academic", "Technical", "Administrative", "General"];
  const statuses = ["All", "Pending", "In Progress", "Resolved"];

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <Card className={`border-l-4 border-l-${color}-500`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 text-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
          Student Concerns
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Voice your concerns, get support, and help build a better academic community together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/add-concern">
              <Plus className="mr-2 h-4 w-4" />
              Submit New Concern
            </Link>
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <StatCard title="Total Concerns" value={stats.total} icon={MessageSquare} color="blue" />
        <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="yellow" />
        <StatCard title="Pending" value={stats.pending} icon={AlertTriangle} color="red" />
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="mb-8 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search concerns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category-filter">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      <div className="flex items-center">
                        <SortDesc className="mr-2 h-4 w-4" />
                        Newest First
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <div className="flex items-center">
                        <SortAsc className="mr-2 h-4 w-4" />
                        Oldest First
                      </div>
                    </SelectItem>
                    <SelectItem value="most_helpful">
                      <div className="flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Most Helpful
                      </div>
                    </SelectItem>
                    <SelectItem value="most_replies">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Most Replies
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setCategoryFilter("All");
                    setSortBy("newest");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Concerns Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <AnimatePresence>
          {filteredConcerns.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
            >
              {filteredConcerns.map((concern, index) => (
                <motion.div
                  key={concern.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ConcernCard concern={concern} onUpdate={fetchConcerns} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              className="text-center text-muted-foreground mt-16 text-xl py-8 border border-dashed border-border rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              No concerns match your current filters. Try adjusting your search or filter criteria.
            </motion.p>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ConcernsPage;