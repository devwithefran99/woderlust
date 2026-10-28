'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link  from 'next/link';
import { redirect } from "next/navigation";
import React from "react";


export default function SignUpPage() {
const handleEmailSignUp = async (e:React.SubmitEvent<HTMLElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const user = Object.fromEntries(formData.entries()) as {name : string , image : string , email:string, password:string}
   

    const { data, error } = await authClient.signUp.email({
        ...user
    })
    if(data) {
       redirect('/')
    }
    if(error) {
        console.log("soluloluuu!")
    }
}
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Welcome back
            </CardTitle>
            <CardDescription>
              Login with your Google account or email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleEmailSignUp}>
              <FieldGroup>
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full" >
                    Login with Google
                  </Button>
                </Field>

                <FieldSeparator>
                  Or continue with
                </FieldSeparator>

                 <Field>
                  <FieldLabel htmlFor="name">
                    Name
                  </FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter Your Name Here"
                    className="w-full"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">
                    Image
                  </FieldLabel>
                  <Input
                    id="imagw"
                    type="url"
                    name="image"
                    placeholder="Image Url"
                    className="w-full"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    className="w-full"
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="password">
                      Password
                    </FieldLabel>
                    <Link href="#"
                      className="text-xs sm:text-sm hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full"
                    required
                  />
                </Field>

                <Field>
                  <Button type="submit" className="w-full">
                    Sign-up
                  </Button>

                  <FieldDescription className="text-center">
                    have an account?{" "}
                    <Link href="/login" className="underline">
                     Log In
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="mt-5 px-2 text-center text-xs sm:text-sm">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>.
        </FieldDescription>
      </div>
    </div>
  );
}
