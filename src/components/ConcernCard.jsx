import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { UserCircle, CalendarDays, Tag, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CONCERN_STATUSES } from '@/lib/constants';

const ConcernCard = ({ concern, index }) => {
  const { title, message, timestamp, author, concern_type, status } = concern; // concern_type from Supabase

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case CONCERN_STATUSES.NEW:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case CONCERN_STATUSES.UNDER_REVIEW:
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case CONCERN_STATUSES.SOLVED:
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case CONCERN_STATUSES.IGNORED:
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -6, boxShadow: "0px 12px 25px hsla(var(--primary), 0.15), 0px 5px 10px hsla(var(--primary), 0.1)" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:border-primary/60 bg-card shadow-md hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg lg:text-xl font-semibold text-foreground leading-tight">{title}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground pt-1.5 space-x-3">
            <div className="flex items-center">
                <UserCircle className="h-3.5 w-3.5 mr-1" />
                <span>{author || 'Anonymous'}</span>
            </div>
            <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                <span>{formatDate(timestamp)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow py-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{message}</p>
        </CardContent>
        <CardFooter className="pt-3 pb-4 flex flex-wrap gap-2 justify-between items-center">
          <div className={cn("text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center border", getStatusColor(status))}>
            <Activity className="h-3.5 w-3.5 mr-1.5" />
            {status || 'Unknown'}
          </div>
          {concern_type && (
            <div className="text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center bg-secondary/10 text-secondary border border-secondary/20">
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              {concern_type}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConcernCard;