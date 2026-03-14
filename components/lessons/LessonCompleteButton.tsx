"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 , Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLessonCompletion } from "@/lib/actions";

interface LessonCompleteButtonProps {
  lessonId: string;
  lessonSlug: string;
  isCompleted: boolean;
}

export function LessonCompleteButton({
  lessonId,
  lessonSlug,
  isCompleted: initialCompleted,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleLessonCompletion(
        lessonId,
        lessonSlug,
        !isCompleted,
      );
      if (result.success) {
        setIsCompleted(result.isCompleted);
      }
    });
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      variant={isCompleted ? "ghost" : "default"}
      className={
        isCompleted
          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
          : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-300 hover:to-emerald-400 text-white border-0"
      }>
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-4 h-4 mr-2" />
      ) : (
        <Circle className="w-4 h-4 mr-2" />
      )}
      {isCompleted ? "Completed" : "Mark as Complete"}
    </Button>
  );
}
