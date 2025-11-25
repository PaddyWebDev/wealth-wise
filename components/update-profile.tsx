"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/lib/auth-form-schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useSessionContext } from "@/context/session";
import { useSession } from "next-auth/react";

interface updateProfile {
  userData: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}
export default function UpdateProfile({ userData }: updateProfile) {
  const { session } = useSessionContext();
  const { update } = useSession();
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
      phoneNumber: userData?.phoneNumber,
    },
  });

  if (!userData || userData === null) {
    router.push("/auth/dashboard");
  }

  const onSubmit = async (formData: UpdateProfileFormData) => {
    startTransition(async function () {
      try {
        const validatedFields = updateProfileSchema.safeParse(formData);
        if (!validatedFields.data || validatedFields.error) {
          toast.error("Failed to validate fields");
          return;
        }

        const isSame =
          validatedFields.data.name === userData.name &&
          validatedFields.data.email === userData.email &&
          validatedFields.data.phoneNumber === userData.phoneNumber;
        if (isSame) {
          toast.error("Modify the data to update");
          return;
        }

        const response = await axios.patch(
          `/api/update-user?userId=${session?.user.id}`,
          validatedFields.data
        );
        console.log(response.data);

        toast.success("Profile updated successfully!");
        await update({
          ...session,
          user: {
            name: validatedFields.data.name,
            email: validatedFields.data.email,
            ...session?.user,
          },
        });
        router.push("/auth/profile");
      } catch (error) {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <section className="container mx-auto p-6 bg-neutral-50 dark:bg-neutral-900 min-h-fit">
      <div className="max-w-md mx-auto">
        <Card className="bg-white dark:bg-neutral-800 shadow-lg mt-[10dvh]">
          <CardHeader>
            <CardTitle className="text-neutral-800 dark:text-neutral-200 text-3xl font-bold">
              Update Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          disabled={isPending}
                          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled={isPending}
                          placeholder="Enter your email"
                          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700 dark:text-neutral-300">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          disabled={isPending}
                          placeholder="Enter your email"
                          className="bg-neutral-50 dark:bg-neutral-950 border-neutral-300 dark:border-neutral-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
