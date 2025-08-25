import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  LogIn,
  AlertTriangle,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = ({ handleAdminLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Both email and password are required.");
      setIsLoading(false);
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            <span className="font-semibold">Input Required</span>
          </div>
        ),
        description: "Please enter both email and password.",
        variant: "default",
      });
      return;
    }

    const loginSuccess = await handleAdminLogin(email, password);
    setIsLoading(false);

    if (loginSuccess) {
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-semibold">Login Successful</span>
          </div>
        ),
        description: "Redirecting to the admin dashboard...",
      });
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials or login error. Please try again.");
      toast({
        title: (
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">Login Failed</span>
          </div>
        ),
        description:
          "Invalid email or password, or an error occurred. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-16 md:py-24 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4"
    >
      <motion.div
        className="w-full max-w-md p-8 bg-card/70 backdrop-blur-sm border border-border rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-center mb-8">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold gradient-text">
            Administrator Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Restricted area. Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="mt-1"
            />
          </div>
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              className="mt-1 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          <Button
            type="submit"
            size="lg"
            className="w-full group bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In Securely"}
            {!isLoading && (
              <LogIn className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </Button>
        </form>
      </motion.div>
      <p className="text-xs text-muted-foreground mt-8 text-center max-w-md">
        Admin credentials are managed via a secure database. Contact your
        administrator if you encounter any issues.
      </p>
    </motion.div>
  );
};

export default AdminLoginPage;
