import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CONCERN_STATUSES } from '@/lib/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListChecks, AlertCircle, CheckCircle, XCircle, Activity, Loader2 } from 'lucide-react';

const StatusBoardPage = ({ concerns, loading }) => {

  const statusCounts = useMemo(() => {
    const counts = {
      [CONCERN_STATUSES.NEW]: 0,
      [CONCERN_STATUSES.UNDER_REVIEW]: 0,
      [CONCERN_STATUSES.SOLVED]: 0,
      [CONCERN_STATUSES.IGNORED]: 0,
      Total: 0,
    };
    concerns.forEach(concern => {
      if (counts[concern.status] !== undefined) {
        counts[concern.status]++;
      }
      counts.Total++;
    });
    return counts;
  }, [concerns]);

  const pieData = Object.entries(statusCounts)
    .filter(([key]) => key !== 'Total' && statusCounts[key] > 0) 
    .map(([name, value]) => ({ name, value }));

  const COLORS = {
    [CONCERN_STATUSES.NEW]: '#3b82f6', 
    [CONCERN_STATUSES.UNDER_REVIEW]: '#f59e0b', 
    [CONCERN_STATUSES.SOLVED]: '#22c55e', 
    [CONCERN_STATUSES.IGNORED]: '#ef4444', 
  };
  
  const summaryStats = [
    { title: 'Total Concerns', value: statusCounts.Total, icon: <ListChecks className="h-6 w-6 text-primary" /> , color: "text-primary" },
    { title: 'New', value: statusCounts[CONCERN_STATUSES.NEW], icon: <AlertCircle className="h-6 w-6 text-blue-500" />, color: "text-blue-500" },
    { title: 'Under Review', value: statusCounts[CONCERN_STATUSES.UNDER_REVIEW], icon: <Activity className="h-6 w-6 text-yellow-500" />, color: "text-yellow-500" },
    { title: 'Solved', value: statusCounts[CONCERN_STATUSES.SOLVED], icon: <CheckCircle className="h-6 w-6 text-green-500" />, color: "text-green-500" },
    { title: 'Ignored', value: statusCounts[CONCERN_STATUSES.IGNORED], icon: <XCircle className="h-6 w-6 text-red-500" />, color: "text-red-500" },
  ];

  const typeCounts = useMemo(() => {
    const counts = {};
    concerns.forEach(concern => {
      counts[concern.concern_type] = (counts[concern.concern_type] || 0) + 1; // Matches DB column
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [concerns]);


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
        Concerns Status Board
      </motion.h1>
      <motion.p 
        className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Visual overview of student concerns, their current statuses, and distribution by type. Data is fetched live from Supabase.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
        {summaryStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="shadow-lg bg-card/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${stat.color}`}>{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{loading ? <Loader2 className="h-7 w-7 animate-spin" /> : stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {loading && !concerns.length ? (
         <div className="flex justify-center items-center h-60">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
         </div>
      ) : concerns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-xl bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Concerns by Status</CardTitle>
                <CardDescription>Distribution of concerns based on their current resolution status.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => window.innerWidth > 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#888888'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} (${(value/statusCounts.Total*100).toFixed(1)}%)`, name]}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Concerns by Type</CardTitle>
                <CardDescription>Number of concerns raised for each category.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeCounts} layout="vertical" margin={{ right: 10, left: 10, bottom: 5, top: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} interval={0} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <motion.p 
          className="text-center text-muted-foreground text-xl py-12 border border-dashed border-border rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          No concerns data available to display statistics. Add some concerns first!
        </motion.p>
      )}

    </motion.div>
  );
};

export default StatusBoardPage;