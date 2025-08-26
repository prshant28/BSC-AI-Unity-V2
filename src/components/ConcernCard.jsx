
import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Calendar,
  Tag,
  User,
  MessageSquare,
  Trash2,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ConcernCard = ({ concern, onUpdate, isAdmin = false }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState({
    helpful: concern.helpful_votes || 0,
    not_helpful: concern.not_helpful_votes || 0,
  });
  const [userVote, setUserVote] = useState(null);
  const [replies, setReplies] = useState(concern.replies || []);
  const { toast } = useToast();

  const handleVote = async (voteType) => {
    if (!concern.id) return;

    try {
      // Check if user already voted (simplified for now)
      const sessionId = localStorage.getItem('userSession') || 'anonymous_' + Date.now();
      localStorage.setItem('userSession', sessionId);

      // Update concern vote counts directly
      const updateField = voteType === 'helpful' ? 'helpful_votes' : 'not_helpful_votes';
      const { error } = await supabase
        .from('concerns')
        .update({
          [updateField]: (concern[updateField] || 0) + 1
        })
        .eq('id', concern.id);

      if (error) throw error;

      setVotes(prev => ({
        ...prev,
        [voteType === 'helpful' ? 'helpful' : 'not_helpful']: prev[voteType === 'helpful' ? 'helpful' : 'not_helpful'] + 1
      }));

      toast({
        title: "Vote Recorded",
        description: "Thank you for your feedback!",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const newReply = {
        concern_id: concern.id,
        reply_text: replyText,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("concern_replies")
        .insert([newReply]);

      if (error) throw error;

      setReplies([...replies, newReply]);
      setReplyText("");
      setIsReplyDialogOpen(false);

      if (onUpdate) onUpdate();

      toast({
        title: "Reply Added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('concerns')
        .delete()
        .eq('id', concern.id);

      if (error) throw error;

      toast({
        title: "Concern Deleted",
        description: "The concern has been permanently deleted.",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting concern:', error);
      toast({
        title: "Error",
        description: "Failed to delete concern: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleHide = async () => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('concerns')
        .update({
          is_hidden: true,
          hidden_at: new Date().toISOString(),
          hidden_by: 'Admin'
        })
        .eq('id', concern.id);

      if (error) throw error;

      toast({
        title: "Concern Hidden",
        description: "The concern has been hidden from public view.",
      });

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error hiding concern:', error);
      toast({
        title: "Error",
        description: "Failed to hide concern: " + error.message,
        variant: "destructive",
      });
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 bg-card/90 backdrop-blur-sm border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-foreground flex-1 leading-tight">
              {concern.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  concern.status
                )}`}
              >
                {concern.status || "Pending"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  concern.category
                )}`}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {concern.category || "General"}
              </span>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleHide} className="cursor-pointer">
                      <EyeOff className="w-4 h-4 mr-2" />
                      Hide Concern
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this concern? This action cannot be undone.')) {
                          handleDelete();
                        }
                      }}
                      className="cursor-pointer text-red-600 focus:bg-red-600/10 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Concern
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <div className="mb-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {concern.description || concern.message}
            </p>
          </div>

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{concern.student_name || concern.author || 'Anonymous'}</span>
              {concern.student_id && (
                <>
                  <span>•</span>
                  <span>{concern.student_id}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{new Date(concern.created_at).toLocaleDateString()}</span>
            </div>
            {concern.contact_info && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="truncate">{concern.contact_info}</span>
              </div>
            )}
          </div>

          {replies.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                Replies ({replies.length})
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {replies.slice(-3).map((reply, index) => (
                  <div key={index} className="text-xs p-3 bg-muted/50 rounded-lg border">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-foreground">Admin</span>
                      <span className="text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{reply.reply_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("helpful")}
                disabled={loading}
                className={`flex items-center gap-1 ${
                  userVote === "helpful" ? "text-green-600 bg-green-50" : ""
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-medium">{votes.helpful}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("not_helpful")}
                disabled={loading}
                className={`flex items-center gap-1 ${
                  userVote === "not_helpful" ? "text-red-600 bg-red-50" : ""
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-xs font-medium">{votes.not_helpful}</span>
              </Button>
            </div>

            {isAdmin && (
              <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reply to Concern</DialogTitle>
                    <DialogDescription>
                      Post a reply to "{concern.title}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSubmitReply}
                      disabled={loading || !replyText.trim()}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                        </motion.div>
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Post Reply
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConcernCard;
