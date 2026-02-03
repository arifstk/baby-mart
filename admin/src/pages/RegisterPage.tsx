
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { Card, CardDescription, CardFooter } from "@/components/ui/card"
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { registerSchema } from "@/lib/validation"

type FormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    console.log("register data:", data);
    // TODO: API call here
    setTimeout(() => {
      setIsLoading(false)
      navigate("/dashboard")
    }, 1500)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-2"
      >
        <Card className="p-6 shadow-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800">Create an Account</h1>
          <CardDescription className="text-gray-500 text-center">
            Enter your details to sign up
          </CardDescription>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" type="input" {...register("name")} placeholder="Type your name" disabled={isLoading} />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} placeholder="yourmail@example.com" disabled={isLoading} />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" {...register("password")} placeholder="Enter your password" />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Input id="role" type="role" placeholder="User" {...register("role")} disabled={isLoading} className="border-gray-300 bg-gray-100 text-gray-500" />
                {errors.role && <FieldError>{errors.role.message}</FieldError>}
              </Field>

              {/* <Field>
                <FieldLabel>Role</FieldLabel>
                <select id="role" {...register("role")} disabled={isLoading} >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="delivery">Delivery</option>
                  {errors.role && <FieldError>{errors.role.message}</FieldError>}
                </select>
              </Field> */}
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign up"}
            </Button>

            <CardFooter className="flex items-center justify-center">
              <p className="text-sm text-gray-600  flex gap-4">Already have an account ? {" "}<Link to={"/login"} className="text-indigo-600 hover:text-indigo-800 hover:underline hoverEffect" >Sign in</Link> </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
