import { auth } from '@/auth'
import React from 'react'

export default async function page() {
  const data = await auth();
  console.log(data);
  return (
    <div>page</div>
  )
}
