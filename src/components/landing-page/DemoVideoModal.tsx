"use client";

import { Play } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const DemoVideoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-8 py-6 text-lg transition-all duration-300 hover:border-zinc-500"
        >
          <Play className="mr-2 h-5 w-5" />
          Watch Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl sm:h-[38rem] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Heysheet demo video</DialogTitle>
        </DialogHeader>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/YlrmL46QIlc?si=tjL-TfEY2xoP8wCa"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </DialogContent>
    </Dialog>
  );
};
