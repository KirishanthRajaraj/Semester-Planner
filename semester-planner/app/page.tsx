import TextareaPlanner from "@/components/textareaPlanner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function Home() {
  return (
      <div className="container font-sans flex flex-col flex-1 items-center justify-center">
        <TextareaPlanner className="w-full" />
      </div>
  );
}
