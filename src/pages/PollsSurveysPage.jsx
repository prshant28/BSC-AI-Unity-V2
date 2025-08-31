
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Vote,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const PollsSurveysPage = () => {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: "Course Pace Feedback",
      description: "How do you find the current pace of the course?",
      type: "poll",
      status: "active",
      endDate: "2025-02-15",
      responses: 45,
      totalVoters: 120,
      options: [
        { text: "Too Fast", votes: 12, percentage: 27 },
        { text: "Just Right", votes: 25, percentage: 56 },
        { text: "Too Slow", votes: 8, percentage: 17 },
      ],
    },
    {
      id: 2,
      title: "Study Group Preference",
      description: "What type of study group sessions would you prefer?",
      type: "poll",
      status: "active",
      endDate: "2025-02-20",
      responses: 32,
      totalVoters: 120,
      options: [
        { text: "Video Calls", votes: 18, percentage: 56 },
        { text: "Text Chat", votes: 8, percentage: 25 },
        { text: "In-person (if possible)", votes: 6, percentage: 19 },
      ],
    },
    {
      id: 3,
      title: "Mid-Semester Feedback Survey",
      description: "Complete feedback on course content, delivery, and platform",
      type: "survey",
      status: "upcoming",
      startDate: "2025-02-25",
      endDate: "2025-03-05",
      responses: 0,
      totalVoters: 120,
    },
  ]);

  const activePollsCount = polls.filter((poll) => poll.status === "active").length;
  const completedPollsCount = polls.filter((poll) => poll.status === "completed").length;
  const upcomingPollsCount = polls.filter((poll) => poll.status === "upcoming").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Vote className="h-5 w-5 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case "upcoming":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-12 px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">
          Polls & Surveys
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your voice matters! Participate in polls and surveys to help improve the course
          experience and share your valuable feedback with the community.
        </p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Vote className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-foreground">{activePollsCount}</p>
            <p className="text-sm text-muted-foreground">Active Polls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <p className="text-2xl font-bold text-foreground">{completedPollsCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-foreground">{upcomingPollsCount}</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Polls and Surveys List */}
      <div className="space-y-6">
        {polls.map((poll, index) => (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(poll.status)}
                    <div>
                      <CardTitle className="text-xl">{poll.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {poll.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(poll.status)}
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {poll.responses}/{poll.totalVoters} responses
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {poll.type === "poll" && poll.options && (
                  <div className="space-y-3 mb-4">
                    {poll.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {option.text}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <Progress value={option.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {poll.status === "upcoming" ? (
                        <span>Starts: {poll.startDate}</span>
                      ) : (
                        <span>Ends: {poll.endDate}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>
                        {Math.round((poll.responses / poll.totalVoters) * 100)}%
                        participation
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {poll.status === "active" && (
                      <Button size="sm">
                        {poll.type === "poll" ? "Vote Now" : "Take Survey"}
                      </Button>
                    )}
                    {poll.status === "completed" && (
                      <Button size="sm" variant="outline">
                        View Results
                      </Button>
                    )}
                    {poll.status === "upcoming" && (
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Your Feedback Drives Improvement
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Regular polls and surveys help us understand your needs, improve the
              course experience, and build a stronger learning community. Every
              response counts!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-500 mb-2">85%</div>
                <div className="text-sm text-muted-foreground">
                  Average participation rate
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500 mb-2">12</div>
                <div className="text-sm text-muted-foreground">
                  Improvements implemented
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500 mb-2">24h</div>
                <div className="text-sm text-muted-foreground">
                  Average response time
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PollsSurveysPage;
