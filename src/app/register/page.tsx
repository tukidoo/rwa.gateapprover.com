"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/providers/auth-provider";
import type { RegisterInput } from "@/types/models/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  userType: z.enum([
    "Resident",
    "Owner",
    "Tenant",
    "Security",
    "Maintenance",
    "Services",
    "Helper",
  ]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register: registerUser,
    registerLoading,
    registerError,
    registerResponse,
    session,
  } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      userType: "Resident",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (session.user && !session.loading) {
      router.replace("/dashboard");
    }
  }, [session.user, session.loading, router]);

  // Redirect to login after successful registration
  useEffect(() => {
    if (registerResponse && registerResponse.success) {
      setTimeout(() => {
        router.push("/login?message=Registration successful! Please log in.");
      }, 2000);
    }
  }, [registerResponse, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitted(true);
    const result = await registerUser(data as RegisterInput);

    if (!result) {
      setIsSubmitted(false);
    }
  };

  // Show loading if checking auth state
  if (session.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't show register form if already logged in
  if (session.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to get started
          </CardDescription>
        </CardHeader>

        {registerResponse && registerResponse.success ? (
          <CardContent className="text-center">
            <div className="text-green-600 bg-green-50 p-4 rounded-md">
              <h3 className="font-semibold">Registration Successful!</h3>
              <p className="text-sm mt-1">Redirecting to login page...</p>
            </div>
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            disabled={registerLoading || isSubmitted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            disabled={registerLoading || isSubmitted}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                          disabled={registerLoading || isSubmitted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          disabled={registerLoading || isSubmitted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          {...field}
                          disabled={registerLoading || isSubmitted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          disabled={registerLoading || isSubmitted}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Resident">Resident</SelectItem>
                            <SelectItem value="Owner">Owner</SelectItem>
                            <SelectItem value="Tenant">Tenant</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Maintenance">
                              Maintenance
                            </SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                            <SelectItem value="Helper">Helper</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {registerError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {registerError}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerLoading || isSubmitted}
                >
                  {registerLoading || isSubmitted ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <div className="text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push("/login")}
                  >
                    Sign in
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
}
