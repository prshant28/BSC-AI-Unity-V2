
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  Trash2,
  EyeOff,
  Eye,
  MoreVertical,
  Send,
  User,
  Calendar,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Reply,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const AdminConcernsPage = () => {
  const [concerns, setConcerns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showHidden, setShowHidden] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [concernToDelete, setConcernToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
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

      if (!showHidden) {
        try {
          query = query.or("is_hidden.is.null,is_hidden.eq.false");
        } catch (error) {
          console.warn("is_hidden column may not exist yet:", error);
        }
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      const processedData = data.map(concern => ({
        ...concern,
        replies: concern.concern_replies || [],
        reply_count: concern.concern_replies?.length || 0,
      }));

      setConcerns(processedData);
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
  }, [showHidden]);

  const handleReply = (concern) => {
    setSelectedConcern(concern);
    setReplyText("");
    setIsReplyModalOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedConcern) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("concern_replies")
        .insert([{
          concern_id: selectedConcern.id,
          reply_text: replyText,
          author: "Admin",
          created_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      setIsReplyModalOpen(false);
      setReplyText("");
      setSelectedConcern(null);
      fetchConcerns();

      toast({
        title: "Reply Posted",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply: " + error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (concern) => {
    setConcernToDelete(concern);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!concernToDelete) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('concerns')
        .delete()
        .eq('id', concernToDelete.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setConcernToDelete(null);
      fetchConcerns();

      toast({
        title: "Concern Deleted",
        description: "The concern has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting concern:', error);
      toast({
        title: "Error",
        description: "Failed to delete concern: " + error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleHidden = async (concern) => {
    setActionLoading(true);
    try {
      const newHiddenState = !concern.is_hidden;
      const { error } = await supabase
        .from('concerns')
        .update({
          is_hidden: newHiddenState,
          hidden_at: newHiddenState ? new Date().toISOString() : null,
          hidden_by: newHiddenState ? 'Admin' : null
        })
        .eq('id', concern.id);

      if (error) throw error;

      fetchConcerns();

      toast({
        title: newHiddenState ? "Concern Hidden" : "Concern Restored",
        description: newHiddenState 
          ? "The concern has been hidden from public view." 
          : "The concern has been restored to public view.",
      });
    } catch (error) {
      console.error('Error toggling concern visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update concern visibility: " + error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (concernId, newStatus) => {
    try {
      const { error } = await supabase
        .from('concerns')
        .update({ status: newStatus })
        .eq('id', concernId);

      if (error) throw error;

      fetchConcerns();

      toast({
        title: "Status Updated",
        description: `Concern status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status: " + error.message,
        variant: "destructive",
      });
    }
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "in progress":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "pending":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      technical: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
      administrative: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
      general: "text-gray-600 bg-gray-100 dark:bg-gray-900/20",
    };
    return colors[category?.toLowerCase()] || colors.general;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Concerns</h1>
          <p className="text-muted-foreground">Review, reply to, and manage student concerns</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showHidden ? "default" : "outline"}
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
            {showHidden ? "Show All" : "Show Hidden"}
          </Button>
          <Button onClick={fetchConcerns} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Concerns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
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
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Administrative">Administrative</SelectItem>
                  <SelectItem value="General">General</SelectItem>
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
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concerns List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConcerns.length > 0 ? (
            filteredConcerns.map((concern) => (
              <Card key={concern.id} className={`${concern.is_hidden ? 'opacity-60 border-dashed' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{concern.title}</h3>
                        {concern.is_hidden && (
                          <span className="text-xs bg-gray-500/20 text-gray-600 px-2 py-1 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{concern.student_name || concern.author || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(concern.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{concern.reply_count} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{concern.helpful_votes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span>{concern.not_helpful_votes || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Select value={concern.status || "Pending"} onValueChange={(value) => handleStatusUpdate(concern.id, value)}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(concern.category)}`}>
                          <Tag className="w-3 h-3 inline mr-1" />
                          {concern.category || "General"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReply(concern)}
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleHidden(concern)}>
                            {concern.is_hidden ? (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Show Concern
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Hide Concern
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(concern)}
                            className="text-red-600 focus:bg-red-600/10 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Concern
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{concern.description || concern.message}</p>
                  
                  {concern.replies && concern.replies.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Replies ({concern.replies.length})</h4>
                      {concern.replies.map((reply, index) => (
                        <div key={index} className="bg-muted p-3 rounded text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p>{reply.reply_text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-12 border border-dashed rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-lg">No concerns found</p>
              <p className="text-sm">Concerns will appear here once students submit them</p>
            </div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Concern</DialogTitle>
            <DialogDescription>
              Post a reply to "{selectedConcern?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReply}
              disabled={actionLoading || !replyText.trim()}
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Concern</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the concern "{concernToDelete?.title}"? 
              This action cannot be undone and will also delete all associated replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete Concern"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default AdminConcernsPage;
