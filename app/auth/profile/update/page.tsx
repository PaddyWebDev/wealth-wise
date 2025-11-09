"use client"
import { useQuery } from '@tanstack/react-query'
import { getUserByIdForUpdate, getSessionUser } from '@/hooks/user'
import UpdateProfile from '@/components/update-profile'
import Loader from '@/components/Loader';
import { TriangleAlert } from 'lucide-react';

export default function UpdateProfilePage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await getUserByIdForUpdate((await getSessionUser())?.user.id!)
        }
    })


    if (isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='dark:bg-neutral-800 bg-neutral-100 px-5 py-3 rounded-xl shadow-md'>
                    <h1 className='text-3xl font-bold text-red-600 dark:text-red-500 flex items-center justify-center gap-3'>Error Occurred <TriangleAlert strokeWidth={2} /></h1>
                </div>
            </div>
        )
    }

    return (
        <UpdateProfile userData={data} />
    )
}
