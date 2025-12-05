"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type TorneioConvite = {
  id: string;
  nome: string;
  data: string;
  finalizado?: boolean;
  _count?: { partidas?: number };
};

export default function ConvitePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [torneio, setTorneio] = useState<TorneioConvite | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/torneios/${id}/convite`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setTorneio(data.torneio);
        }
      } catch (e) {
        setError("Erro ao carregar convite");
      }
      setLoading(false);
    }

    load();
  }, [id]);

  const temConfrontos = (torneio?._count?.partidas ?? 0) > 0;
  const status = torneio
    ? torneio.finalizado
      ? {
          label: "Finalizado",
          className:
            "inline-block text-[11px] px-2 py-0.5 rounded-full bg-[#1F5C3F] text-[#D8F3DC] border border-[#3FA072]",
        }
      : temConfrontos
        ? {
            label: "Em disputa",
            className:
              "inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/50",
          }
        : {
            label: "Esperando confrontos",
            className:
              "inline-block text-[11px] px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-100 border border-gray-400/40",
          }
    : null;

  async function aceitarConvite() {
    if (!torneio) return;
    if (torneio.finalizado) {
      alert("Não é possível entrar em torneio finalizado.");
      return;
    }
    if (temConfrontos) {
      alert("Confrontos já gerados. Não é possível entrar.");
      return;
    }

    const res = await fetch(`/api/torneios/${id}/convite`, {
      method: "POST",
    });

    const json = await res.json();

    if (json.error) {
      alert(json.error);
      return;
    }

    alert("Você entrou no torneio!");
    router.push("/torneios");
  }

  if (loading)
    return <div className="text-white p-10">Carregando...</div>;

  if (error)
    return <div className="text-[#C34141] p-10">{error}</div>;

  if (!torneio) {
    return <div className="text-white p-10">Convite não disponível</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white/10 border border-white/20 p-8 rounded-xl text-white w-[90%] max-w-md text-center backdrop-blur-lg">
        <h1 className="text-2xl font-bold mb-2">Convite para torneio</h1>
        <p className="opacity-80">{torneio.nome}</p>

        {status ? <span className={status.className}>{status.label}</span> : null}

        <p className="mt-4 text-sm opacity-75">
          Data: {new Date(torneio.data).toLocaleDateString("pt-BR")}
        </p>

        <button
          onClick={aceitarConvite}
          className="mt-6 w-full bg-[#3FA072] hover:bg-[#358a60] border border-[#358a60] px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!torneio || temConfrontos || torneio.finalizado}
        >
          Aceitar convite
        </button>

        <button
          onClick={() => router.push("/torneios")}
          className="mt-3 w-full bg-[#D35252] hover:bg-[#C34141] border border-[#C34141] px-4 py-2 rounded-lg font-semibold text-white"
        >
          Recusar convite
        </button>
      </div>
    </main>
  );
}
