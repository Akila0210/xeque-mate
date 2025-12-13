"use client";

import { useEffect, useState } from "react";
import { ChessPuzzle } from "@react-chess-tools/react-chess-puzzle";
import { Button } from "@/components/ui/button";
import { FlagIcon, HelpCircleIcon } from "lucide-react";

type WeeklyPuzzleClientProps = {
  fen: string;
  moves: string[];
  rating: number;
  themes: string;
  title?: string;
  nextChange?: string; // ISO string com data/hora da próxima troca
};

function formatRemaining(ms: number) {
  if (ms <= 0) return "Atualiza em instantes";

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export function WeeklyPuzzleClient({
  fen,
  moves,
  rating,
  themes,
  title = "Desafio Semanal",
  nextChange,
}: WeeklyPuzzleClientProps) {
  const puzzle = {
    fen,
    moves,
    makeFirstMove: true,
  };

  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!nextChange) return;

    const target = new Date(nextChange).getTime();

    const update = () => {
      const now = Date.now();
      setRemaining(formatRemaining(target - now));
    };

    update();
    const id = setInterval(update, 60_000); // a cada 1 minuto

    return () => clearInterval(id);
  }, [nextChange]);

  return (
    <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl p-5 border border-white/30">
      <h1 className="text-2xl font-bold text-white text-center mb-1">
        {title}
      </h1>

      <p className="text-xs text-blue-200 text-center">
        Rating: {rating} • Tema: {themes}
      </p>

      {remaining && (
        <p className="text-[11px] text-blue-100 text-center mb-3">
          Próximo desafio em: {remaining}
        </p>
      )}

      <ChessPuzzle.Root puzzle={puzzle}>
        <ChessPuzzle.Board className="rounded-xl overflow-hidden mb-6" />

        <div className="flex items-center justify-center gap-10 mt-6">
          {/* Reiniciar */}
          <div className="flex flex-col items-center gap-1">
            <ChessPuzzle.Reset
              asChild
              showOn={["not-started", "in-progress", "solved", "failed"]}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/10 border-white/40 text-white hover:bg-white/20"
              >
                <FlagIcon className="w-5 h-5" />
              </Button>
            </ChessPuzzle.Reset>
            <span className="text-xs font-semibold text-white">Reiniciar</span>
          </div>

          {/* Dica */}
          <div className="flex flex-col items-center gap-1">
            <ChessPuzzle.Hint showOn={["in-progress"]} asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/10 border-white/40 text-white hover:bg-white/20"
              >
                <HelpCircleIcon className="w-5 h-5" />
              </Button>
            </ChessPuzzle.Hint>
            <span className="text-xs font-semibold text-white">Dica</span>
          </div>
        </div>
      </ChessPuzzle.Root>
    </div>
  );
}
