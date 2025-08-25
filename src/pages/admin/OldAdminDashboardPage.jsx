import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CONCERN_STATUSES } from "@/lib/constants";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ListFilter, Edit, Save, X, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// This is the original AdminDashboardPage, renamed to OldAdminDashboardPage
// It will be used for the /admin/dashboard/concerns route specifically.

const OldAdminDashboardPage = ({
    concerns: initialConcerns,
    updateConcernStatus,
    loading: initialLoading,
    fetchConcerns,
}) => {
    const { toast } = useToast();
    const [editingConcernId, setEditingConcernId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
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
        setSelectedStatus("");
    };

    const filteredConcerns = concerns.filter(
        (concern) => filterStatus === "All" || concern.status === filterStatus,
    );

    const allConcernStatusesForFilter = [
        "All",
        ...Object.values(CONCERN_STATUSES),
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6" // Removed container and mx-auto for better fit in nested layout
        >
            <motion.h1
                className="text-3xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Manage Student Concerns
            </motion.h1>
            <motion.p
                className="text-sm text-muted-foreground mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Review, update, and track student-submitted concerns.
            </motion.p>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    disabled={loading}
                    size="sm"
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    {loading ? "Refreshing..." : "Refresh Concerns"}
                </Button>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Filter by Status:
                    </span>
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                        disabled={loading}
                    >
                        <SelectTrigger className="w-auto sm:w-[180px] h-9">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            {allConcernStatusesForFilter.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {loading && !concerns.length ? (
                <div className="flex justify-center items-center h-60">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredConcerns.length > 0 ? (
                        filteredConcerns.map((concern, index) => (
                            <motion.div
                                key={concern.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.03,
                                }}
                            >
                                <Card className="bg-card/70 backdrop-blur-sm shadow-md">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-md">
                                                    {concern.title}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    By:{" "}
                                                    {concern.author ||
                                                        "Anonymous"}{" "}
                                                    | Type:{" "}
                                                    {concern.concern_type} |
                                                    Submitted:{" "}
                                                    {new Date(
                                                        concern.timestamp,
                                                    ).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                    concern.status ===
                                                    CONCERN_STATUSES.NEW
                                                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                                        : concern.status ===
                                                            CONCERN_STATUSES.UNDER_REVIEW
                                                          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                                          : concern.status ===
                                                              CONCERN_STATUSES.SOLVED
                                                            ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                                            : concern.status ===
                                                                CONCERN_STATUSES.IGNORED
                                                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                                                              : "bg-slate-500/20 text-slate-600 dark:text-slate-400"
                                                }`}
                                            >
                                                {concern.status}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="py-2">
                                        <p className="text-sm text-muted-foreground">
                                            {concern.message}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end items-center gap-2 pt-3">
                                        {editingConcernId === concern.id ? (
                                            <>
                                                <Select
                                                    value={selectedStatus}
                                                    onValueChange={
                                                        setSelectedStatus
                                                    }
                                                >
                                                    <SelectTrigger className="w-[160px] h-8 text-xs">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(
                                                            CONCERN_STATUSES,
                                                        ).map((statusVal) => (
                                                            <SelectItem
                                                                key={statusVal}
                                                                value={
                                                                    statusVal
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {statusVal}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="xs"
                                                    onClick={() =>
                                                        handleSave(concern.id)
                                                    }
                                                    variant="outline"
                                                    className="text-green-600 border-green-600 hover:bg-green-500/10"
                                                >
                                                    <Save className="mr-1 h-3 w-3" />{" "}
                                                    Save
                                                </Button>
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                    onClick={handleCancel}
                                                >
                                                    <X className="mr-1 h-3 w-3" />{" "}
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(concern)
                                                }
                                                className="text-primary border-primary hover:bg-primary/10"
                                            >
                                                <Edit className="mr-1 h-3 w-3" />{" "}
                                                Update Status
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <motion.p
                            className="text-center text-muted-foreground text-md py-8 border border-dashed border-border rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <ListFilter className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                            No concerns match the current filter, or no concerns
                            found.
                        </motion.p>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default OldAdminDashboardPage;
