"use client"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from "axios";
import { ScaleLoader } from "react-spinners";

export default function NewVerification() {
    const router = useRouter();
    const [success, setSuccess] = useState<boolean>(false);
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            router.push("/guest/Login");
        }

        async function newVerificationSubmit() {
            if (success) return;

            try {
                const response = await axios.post('/api/new-verification', { token });
                toast.success(response.data)
                setSuccess(true);
            } catch (error: any) {
                toast.error(error.response.data || "Error occurred while processing the new verification request")
            }
        }

        newVerificationSubmit();
    }, [success, token, router]);

    return (
        <section className="dark:bg-zinc-800 rounded w-[30rem] p-5 space-y-8">
            <header>
                <h1 className="text-center text-3xl font-semibold mb-2">
                    Confirming your verification
                </h1>
                <p className="text-base font-light text-center">
                    Confirming your email verification
                </p>
            </header>

            <div className="flex items-center w-full justify-center">
                {success ? (
                    <h1 className="dark:text-green-400 text-green-500 text-xl">
                        Email Has been verified
                    </h1>
                ) : (
                    <ScaleLoader />
                )}
            </div>
            <div>
                <Link
                    className="text-zinc-900 underline-offset-4 text-sm hover:underline cursor-pointer dark:text-zinc-50"
                    href="/guest/Login"
                >
                    Back to Login
                </Link>
            </div>
        </section>
    );
}