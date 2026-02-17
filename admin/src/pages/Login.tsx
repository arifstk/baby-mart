
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
} from "@/components/ui/field"
import { motion } from "framer-motion"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { loginSchema } from "@/lib/validation"
import { Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore"
import { toast } from "sonner"
// import { useNavigate } from "react-router-dom"

// const schema = z.object({
//   email: z.string().email("Invalid Email"),
//   password: z.string().min(6, "Password at least 6 characters"),
// })


//1: 
type FormData = z.infer<typeof loginSchema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  //2: 
  // const form = useForm <FormData>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   }
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    // console.log("Login data:", data);
    try {
      await login(data);
      toast.success("Login successful", {
        description: "Welcome back to the admin dashboard",
      });
      // navigate("/dashboard");
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
      
    } catch (error) {
      console.error("Fail to login", error);
    } finally {
      setIsLoading(false);
    }

    // TODO: API call here
    // setTimeout(() => {
    //   setIsLoading(false)
    //   navigate("/dashboard")
    // }, 1500)
  }

  return (
    // <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 via-zinc-300 to-green-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-2"
      >
        <Card className="p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800">Admin Dashboard</h1>
          <CardDescription className="text-gray-500 text-center -mt-5">
            Enter your credentials to sign in
          </CardDescription>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              {/* <FieldLegend>Enter your credentials to sign in</FieldLegend> */}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} placeholder="yourmail@example.com" disabled={isLoading} />
                {/* <FieldDescription>Enter a valid Email</FieldDescription> */}
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" {...register("password")} placeholder="Enter your password" disabled={isLoading} />
                {/* <FieldDescription>Password at least 6 characters</FieldDescription> */}
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ?
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" /> Signing in...
                </span> : "Login"}
            </Button>

            <CardFooter className="flex items-center justify-center">
              <p className="text-sm text-gray-600  flex gap-4">Don't have an account<Link to={"/register"} className="text-indigo-600 hover:text-indigo-800 hover:underline hoverEffect" >Sign up</Link> </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

