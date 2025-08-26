import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONCERN_TYPES, CONCERN_STATUSES } from '@/lib/constants';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddConcernPage = ({ addConcern }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', // Will be 'author' in the database
    title: '',
    message: '',
    concern_type: '', // This matches the database column name
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, concern_type: value }));
    if (errors.concern_type) {
      setErrors(prev => ({ ...prev, concern_type: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Concern title is required.';
    if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters.';
    if (!formData.message.trim()) newErrors.message = 'Detailed message is required.';
    if (formData.message.trim().length < 20) newErrors.message = 'Message must be at least 20 characters.';
    if (!formData.concern_type) newErrors.concern_type = 'Please select a concern type.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const newConcernData = {
      author: formData.name.trim() || 'Anonymous',
      title: formData.title.trim(),
      message: formData.message.trim(),
      concern_type: formData.concern_type, // Matches DB
      status: CONCERN_STATUSES.NEW,
    };

    const result = await addConcern(newConcernData); 

    if (result) { 
      setFormData({ name: '', title: '', message: '', concern_type: '' });
      navigate('/concerns');
    }
    setIsSubmitting(false);
  };

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
        Add Your Concern
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Share your issues, suggestions, or feedback. Your voice is crucial for our collective growth. All submissions are treated with respect.
      </motion.p>

      <motion.form 
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 md:p-8 bg-card/50 backdrop-blur-sm border border-border rounded-xl shadow-xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-foreground">Your Name (Optional)</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name or leave blank for anonymous" 
            className="mt-1" 
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium text-foreground">Concern Title <span className="text-red-500">*</span></Label>
          <Input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="A brief title for your concern" 
            className={`mt-1 ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.title && <p id="title-error" className="text-xs text-red-600 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium text-foreground">Detailed Message <span className="text-red-500">*</span></Label>
          <Textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            placeholder="Describe your concern in detail..." 
            rows={6} 
            className={`mt-1 ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.message && <p id="message-error" className="text-xs text-red-600 mt-1">{errors.message}</p>}
        </div>

        <div>
          <Label htmlFor="concern_type" className="text-sm font-medium text-foreground">Concern Type <span className="text-red-500">*</span></Label>
          <Select value={formData.concern_type} onValueChange={handleSelectChange} disabled={isSubmitting}>
            <SelectTrigger id="concern_type" className={`mt-1 w-full ${errors.concern_type ? 'border-red-500 focus-visible:ring-red-500' : ''}`} aria-invalid={!!errors.concern_type} aria-describedby={errors.concern_type ? "concernType-error" : undefined}>
              <SelectValue placeholder="Select concern type" />
            </SelectTrigger>
            <SelectContent>
              {CONCERN_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.concern_type && <p id="concernType-error" className="text-xs text-red-600 mt-1">{errors.concern_type}</p>}
        </div>

        <div className="pt-2">
          <Button type="submit" size="lg" className="w-full group bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Concern'}
            {!isSubmitting && <Send className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddConcernPage;