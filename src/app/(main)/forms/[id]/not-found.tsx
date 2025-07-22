'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CreateFormModal from "@/components/CreateFormModal";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100svh-6rem)] flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center space-y-6 p-6">

        {/* Illustration */}
        <div className="w-52 mx-auto">
          <Image
            src="https://ik.imagekit.io/q3ksr5fk3/ChatGPT%20Image%20Jul%2022,%202025,%2010_15_35%20AM_11zon.png?updatedAt=1753159870646" 
            alt="Form not found illustration"
            width={1024}
            height={1024}
            className="h-full object-contain"
          />
        </div>

        {/* Message */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          Looks like this form doesn't exist or might have been deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/forms" className="flex items-center gap-2 justify-center text-sm text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Forms
          </Link>
          <CreateFormModal />
        </div>

        {/* Footer */}
        <div className="pt-8 text-xs text-muted-foreground">
          HeySheet &copy; {new Date().getFullYear()}. All rights reserved
        </div>
      </div>
    </div>
  );
}
