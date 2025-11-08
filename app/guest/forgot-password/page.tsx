"use client"



import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { forgotPassSchema } from '@/lib/guest-form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { sendResetPassEmail } from "@/hooks/email"


type forgotPassType = z.infer<typeof forgotPassSchema>
export default function ResetPassword() {
    const [isPending, startTransition] = useTransition()

    const resetPassForm = useForm<forgotPassType>({
        resolver: zodResolver(forgotPassSchema),
        defaultValues: {
            email: ""
        }
    })

    async function handleData(data: forgotPassType) {
        startTransition(async () => {
            await sendResetPassEmail(data)
                .then((data) => {
                    toast.success(data.message)
                    resetPassForm.reset();
                }).catch((error) => {
                    toast.error(error.message)
                })
        })
    }

    return (
        <section className='md:w-[30rem] sm:w-[70%] w-[90%] dark:bg-zinc-800 bg-zinc-100 rounded shadow-md p-5 space-y-8'>
            <header className='text-center'>
                <h1 className='text-3xl font-semibold'>Reset Password</h1>
            </header>

            <div className='w-11/12 mx-auto'>
                <Form {...resetPassForm} >
                    <form className="space-y-6  " onSubmit={resetPassForm.handleSubmit(handleData)}>

                        <FormField
                            control={resetPassForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending}
                                            className="bg-neutral-50 border-neutral-300 dark:bg-neutral-950 dark:border-neutral-950"
                                            type='email' placeholder='john.doe@example.com' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={isPending} type='submit' className='w-full'>
                            {isPending ? ("Loading...") : ("Send Reset Password Link")}
                        </Button>

                    </form>
                </Form>
            </div>

            <footer>
                <Link className="text-zinc-900 underline-offset-4 text-sm  hover:underline cursor-pointer dark:text-zinc-50" href="/guest/Login">Back to Login</Link>
            </footer>
        </section>
    )
}