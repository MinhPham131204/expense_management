import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Simulate an API call (replace with actual logic)
    console.log(isLogin ? "Logging in" : "Signing up", formData);
    // const url = 'localhost:3000/users/'
    
  };

  return (
    <div className="w-screen flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <Card className="w-full max-w-md shadow-lg border rounded-lg bg-white">
        <CardHeader className="text-center py-6">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
              <AlertTitle className="font-semibold">Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 bg-amber-200">
              <Label className="text-gray-700 font-medium">Email</Label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
              />
            </div>
            <div className="space-y-2 bg-amber-200">
              <Label className="text-gray-700 font-medium">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
              />
            </div>
            {!isLogin && (
              <div className="space-y-2 bg-amber-200">
                <Label className="text-gray-700 font-medium">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700  font-semibold py-2 transition-colors"
            >
              <span className="text-cyan-200">{isLogin ? "Login" : "Sign Up"}</span>
            </Button>
          </form>
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full  text-sm font-medium transition-colors"
          >
            <span className="text-blue-600 hover:text-blue-800">
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
            </span> 
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginSignup;