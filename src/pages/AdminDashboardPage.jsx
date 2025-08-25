import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CONCERN_STATUSES } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter, Edit, Save, X, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage = ({ concerns: initialConcerns, updateConcernStatus, loading: initialLoading, fetchConcerns }) => {
  const { toast } = useToast();
  const [editingConcernId, setEditingConcernId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [concerns, setConcerns] = useState(initialConcerns);
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    setConcerns(initialConcerns);
  }, [initialConcerns]);

  useEffect(() => {
    setLoading(initialLoading);
  }, [initialLoading]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchConcerns(); 
    setLoading(false);
     toast({
      title: "Concerns Refreshed",
      description: "Latest concerns have been loaded from the database.",
    });
  };

  const handleEdit = (concern) => {
    setEditingConcernId(concern.id);
    setSelectedStatus(concern.status);
  };

  const handleSave = async (concernId) => {
    await updateConcernStatus(concernId, selectedStatus);
    setEditingConcernId(null);
  };

  const handleCancel = () => {
    setEditingConcernId(null);
    setSelectedStatus('');
  };

  const filteredConcerns = concerns.filter(concern => 
    filterStatus === 'All' || concern.status === filterStatus
  );
  
  const allConcernStatusesForFilter = ['All', ...Object.values(CONCERN_STATUSES)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-extrabold text-center mb-6 gradient-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Dashboard
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Manage and update the status of student concerns. Data is fetched live from Supabase.
      </motion.p>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Concerns'}
        </Button>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus} disabled={loading}>
                <SelectTrigger className="w-auto sm:w-[180px]">
                    <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                    {allConcernStatusesForFilter.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {loading && !concerns.length ? (
         <div className="flex justify-center items-center h-60">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
         </div>
      ) : (
        <div className="space-y-6">
            {filteredConcerns.length > 0 ? filteredConcerns.map((concern, index) => (
            <motion.div
                key={concern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
            >
                <Card className="bg-card/60 backdrop-blur-sm shadow-md">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">{concern.title}</CardTitle>
                            <CardDescription>
                                By: {concern.author || 'Anonymous'} | Type: {concern.concern_type} | Submitted: {new Date(concern.timestamp).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            concern.status === CONCERN_STATUSES.NEW ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                            concern.status === CONCERN_STATUSES.UNDER_REVIEW ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            concern.status === CONCERN_STATUSES.SOLVED ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                            concern.status === CONCERN_STATUSES.IGNORED ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-slate-500/20 text-slate-600 dark:text-slate-400'
                        }`}>
                            {concern.status}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{concern.message}</p>
                </CardContent>
                <CardFooter className="flex justify-end items-center gap-3 pt-4">
                    {editingConcernId === concern.id ? (
                    <>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(CONCERN_STATUSES).map(statusVal => (
                            <SelectItem key={statusVal} value={statusVal}>{statusVal}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <Button size="sm" onClick={() => handleSave(concern.id)} variant="outline" className="text-green-600 border-green-600 hover:bg-green-500/10">
                        <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    </>
                    ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(concern)} className="text-primary border-primary hover:bg-primary/10">
                        <Edit className="mr-2 h-4 w-4" /> Update Status
                    </Button>
                    )}
                </CardFooter>
                </Card>
            </motion.div>
            )) : (
                <motion.p 
                    className="text-center text-muted-foreground text-lg py-10 border border-dashed border-border rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ListFilter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                    No concerns match the current filter, or no concerns found.
                </motion.p>
            )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboardPage;