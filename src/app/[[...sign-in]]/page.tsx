"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const LoginPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            const role = user?.publicMetadata.role;
            
            if (isSignedIn && role) {
                router.push(`/${role}`);
            } else {
                // if not signed in or no role, show the login form
                setIsCheckingAuth(false);
            }

        }
    }, [isLoaded, isSignedIn, user, router])

    

    // Show loading while checking authentication
    if (!isLoaded || isCheckingAuth) {
        return (
            <div className="h-screen flex items-center justify-center bg-sky-100">
                <div className="bg-white p-12 rounded-md shadow-2xl flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image src="/school-management-logo.png" alt="" width={24} height={24} />
                        <h1 className="text-xl font-bold">School Management</h1>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="text-gray-500">Loading...</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="h-screen flex items-center justify-center bg-sky-100">
                <SignIn.Root>
                    <SignIn.Step name="start" className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Image src="/school-management-logo.png" alt="" width={24} height={24} />
                            School Management
                        </h1>
                        <h2>Sign in to your account</h2>

                        <Clerk.GlobalError className="text-sm text-red-300" />

                        <Clerk.Field name="identifier" className="flex flex-col gap-2">
                            <Clerk.Label className="text-xs text-gray-500">Username</Clerk.Label>
                            <Clerk.Input type="text" required className="p-2 rounded-md ring-1 ring-gray-300" />
                            <Clerk.FieldError className="text-xs text-red-400" />
                        </Clerk.Field>

                        <Clerk.Field name="password" className="flex flex-col gap-2">
                            <Clerk.Label className="text-xs text-gray-500">Password</Clerk.Label>
                            <Clerk.Input type="password" required className="p-2 rounded-md ring-1 ring-gray-300" />
                            <Clerk.FieldError className="text-xs text-red-400" />
                        </Clerk.Field>

                        <SignIn.Action submit className="bg-blue-500 text-white my-1 py-2 rounded-md text-sm">Sign In</SignIn.Action>
                    </SignIn.Step>
                </SignIn.Root>
            </div>
        )
    }



}

export default LoginPage;