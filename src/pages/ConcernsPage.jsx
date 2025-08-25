import React, { useState, useMemo } from 'react';
import ConcernCard from '@/components/ConcernCard';
import { CONCERN_TYPES, CONCERN_STATUSES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RotateCcw, Loader2 } from 'lucide-react';

const ConcernsPage = ({ concerns, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredConcerns = useMemo(() => {
    return concerns
      .filter(concern => 
        (concern.title && concern.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (concern.message && concern.message.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(concern => filterType === 'All' || concern.concern_type === filterType) // Matches DB column
      .filter(concern => filterStatus === 'All' || concern.status === filterStatus);
  }, [concerns, searchTerm, filterType, filterStatus]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterStatus('All');
  };
  
  const allConcernTypes = ['All', ...CONCERN_TYPES];
  const allConcernStatuses = ['All', ...Object.values(CONCERN_STATUSES)];

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
        All Concerns
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Browse, filter, and search through all concerns raised by students. Your collective voice fuels change.
      </motion.p>

      <motion.div 
        className="mb-10 p-6 bg-card/50 backdrop-blur-sm border border-border rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search-concern" className="block text-sm font-medium text-foreground mb-1">Search Concerns</label>
            <div className="relative">
              <Input
                id="search-concern"
                type="text"
                placeholder="Search by title or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="filter-type" className="block text-sm font-medium text-foreground mb-1">Filter by Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {allConcernTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-foreground mb-1">Filter by Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {allConcernStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
            <Button variant="ghost" onClick={resetFilters} className="text-sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
      </motion.div>
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : filteredConcerns.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredConcerns.map((concern, index) => (
            <ConcernCard key={concern.id || index} concern={concern} index={index} />
          ))}
        </div>
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
    </motion.div>
  );
};

export default ConcernsPage;