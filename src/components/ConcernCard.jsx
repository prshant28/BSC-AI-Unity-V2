
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
  Heart,
  MessageSquare,
} from "lucide-react";

const ConcernCard = ({ concern, onUpdate }) => {
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
    if (userVote === voteType) return; // Prevent double voting

    setLoading(true);
    try {
      const updates = {};
      if (voteType === "helpful") {
        updates.helpful_votes = votes.helpful + (userVote === "not_helpful" ? 1 : 1);
        if (userVote === "not_helpful") {
          updates.not_helpful_votes = Math.max(0, votes.not_helpful - 1);
        }
      } else {
        updates.not_helpful_votes = votes.not_helpful + (userVote === "helpful" ? 1 : 1);
        if (userVote === "helpful") {
          updates.helpful_votes = Math.max(0, votes.helpful - 1);
        }
      }

      const { error } = await supabase
        .from("concerns")
        .update(updates)
        .eq("id", concern.id);

      if (error) throw error;

      setVotes(updates);
      setUserVote(voteType);
      
      toast({
        title: "Vote Recorded",
        description: `Your vote has been recorded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    setLoading(true);
    try {
      const newReply = {
        concern_id: concern.id,
        reply_text: replyText,
        author: "Admin", // You can make this dynamic
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
      <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
              {concern.title}
            </CardTitle>
            <div className="flex flex-col gap-1 items-end">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  concern.status
                )}`}
              >
                {concern.status || "Pending"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  concern.category
                )}`}
              >
                <Tag className="w-3 h-3 inline mr-1" />
                {concern.category || "General"}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {concern.description}
          </p>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span className="font-medium">{concern.student_name}</span>
              <span>•</span>
              <span>{concern.student_id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(concern.created_at).toLocaleDateString()}</span>
            </div>
            {concern.contact_info && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                <span className="truncate">{concern.contact_info}</span>
              </div>
            )}
          </div>

          {replies.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Replies ({replies.length})</h4>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {replies.slice(-2).map((reply, index) => (
                  <div key={index} className="text-xs p-2 bg-muted rounded text-muted-foreground">
                    <span className="font-medium">{reply.author}:</span> {reply.reply_text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("helpful")}
                disabled={loading}
                className={`flex items-center gap-1 ${
                  userVote === "helpful" ? "text-green-600" : ""
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs">{votes.helpful}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("not_helpful")}
                disabled={loading}
                className={`flex items-center gap-1 ${
                  userVote === "not_helpful" ? "text-red-600" : ""
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span className="text-xs">{votes.not_helpful}</span>
              </Button>
            </div>

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
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConcernCard;
