"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h4>placeholder for the non authenticated user</h4>
      <Link href="/home">head home</Link>
    </div>
  );
}
