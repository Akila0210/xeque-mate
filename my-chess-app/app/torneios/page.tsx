"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Torneio {
  id: string;
  nome: string;
  data: string;
  modo: string;
  finalizado?: boolean;
  _count?: { partidas?: number };
  participantes?: { id: string; user?: { id?: string | null } }[];
}

export default function TorneiosPage() {
  const [torneios, setTorneios] = useState<Torneio[]>([]);
  const [participando, setParticipando] = useState<Torneio[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const resCriados = await fetch("/api/torneios", { cache: "no-store" });
        const jsonCriados = await resCriados.json();
        setTorneios(Array.isArray(jsonCriados) ? jsonCriados : []);

        const resParticipando = await fetch("/api/torneios/participando", { cache: "no-store" });
        const jsonParticipando = await resParticipando.json();
        setParticipando(Array.isArray(jsonParticipando) ? jsonParticipando : []);
      } catch (error) {
        console.error("Erro ao carregar torneios:", error);
      }

      setLoading(false);
    }

    async function loadUser() {
      try {
        const res = await fetch("/api/user");
        const json = await res.json();
        if (json?.id) setUserId(json.id);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
      }
    }

    load();
    loadUser();
  }, []);

  const modeImage = (modo: string) => {
    const map: Record<string, string> = {
      Classic: "/black-pawn.png",
      "Clássico": "/black-pawn.png",
      Bullet: "/black-knight.png",
      Blitz: "/black-bishop.png",
      Rapid: "/black-rook.png",
      "Rápido": "/black-rook.png",
    };
    return map[modo] ?? "/chess.png";
  };

  const statusInfo = (t: Torneio) => {
    const temConfrontos = (t._count?.partidas ?? 0) > 0;
    if (t.finalizado) {
      return {
        label: "Finalizado",
        className:
          "inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-[#D9F4EA] text-[#1E8F63] border border-[#A4E2C7]",
      };
    }
    if (temConfrontos) {
      return {
        label: "Em disputa",
        className:
          "inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/50",
      };
    }
    return {
      label: "Esperando confrontos",
      className:
        "inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-100 border border-gray-400/40",
    };
  };

  const sairDoTorneio = async (t: Torneio) => {
    if (!userId) {
      alert("Não foi possível identificar o usuário.");
      return;
    }

    const participante = t.participantes?.find(
      (p) => p.user?.id === userId || p.id === userId
    );
    if (!participante) {
      alert("Participação não encontrada para este torneio.");
      return;
    }

    const temConfrontos = (t._count?.partidas ?? 0) > 0;
    if (temConfrontos && !t.finalizado) {
      alert("Não é possível sair com confrontos gerados. Aguarde excluir confrontos ou finalizar.");
      return;
    }

    if (!confirm("Deseja sair do torneio?")) return;

    try {
      const res = await fetch(`/api/torneios/${t.id}/participantes/${participante.id}`, {
        method: "DELETE",
      });
      let json: { error?: string; success?: boolean } = {};
      try {
        const text = await res.text();
        json = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok || json.error) {
        alert(json.error ?? "Erro ao sair do torneio");
        return;
      }

      setParticipando((prev) => prev.filter((item) => item.id !== t.id));
      alert("Você saiu do torneio");
    } catch (err) {
      console.error(err);
      alert("Erro ao sair do torneio");
    }
  };

  if (loading) {
    return <p className="text-white p-5">Carregando...</p>;
  }

  return (
    <main className="min-h-screen text-white p-5 flex flex-col gap-6">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Torneios</h1>

        <div className="flex flex-col items-end gap-1 text-sm opacity-80">
          <span>{torneios.length}/5 Torneios criados</span>
          <span>{participando.length}/5 Torneios em disputa</span>
        </div>
      </header>

      {/* CARD DE CRIAR TORNEIO */}
      <section className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-3">
          <img src="/black-king.png" className="w-14 h-14" alt="imagem" />
          <div>
            <h2 className="text-lg font-semibold">Criação de Torneios</h2>
            <p className="text-sm opacity-80">Crie um torneio com suas configurações.</p>
          </div>
        </div>

        <div className="flex-1" />

        <Link
          href="/torneios/novo"
          className="w-full sm:w-auto text-center bg-[#6BAAFD] hover:bg-[#5C9CF0] transition px-4 py-3 rounded-lg text-white font-medium border border-[#5C9CF0]"
        >
          Criar Torneio
        </Link>
      </section>

      {/* LISTA DE TORNEIOS CRIADOS */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Torneios Criados</h2>
        {torneios.length === 0 ? (
          <p className="text-center opacity-60">Nenhum torneio criado ainda</p>
        ) : (
          torneios.map((t) => (
            <article
              key={t.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
            >
              <img src={modeImage(t.modo)} className="w-10 h-10" alt={t.modo} />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{t.nome}</h3>
                <p className="text-sm opacity-80">
                  Modo: <span className="font-semibold">{t.modo}</span>
                </p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </p>
                {(() => {
                  const status = statusInfo(t);
                  return <span className={status.className}>{status.label}</span>;
                })()}
              </div>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:justify-end sm:items-center">
                <Link
                  href={`/torneios/${t.id}`}
                  className="w-full sm:w-auto text-center bg-[#4CCB8A] hover:bg-[#3FB479] border border-[#3FB479] px-4 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Acessar
                </Link>

                <Link
                  href={`/torneios/${t.id}/editar`}
                  className="w-full sm:w-auto text-center bg-[#6BAAFD] hover:bg-[#5C9CF0] px-4 py-2 rounded-lg text-sm font-semibold text-white border border-[#5C9CF0]"
                >
                  Editar
                </Link>

                <button
                  onClick={async () => {
                    if (!confirm("Tem certeza que deseja excluir?")) return;

                    await fetch(`/api/torneios/${t.id}`, {
                      method: "DELETE",
                    });

                    setTorneios((prev) =>
                      prev.filter((item) => item.id !== t.id)
                    );
                  }}
                  className="w-full sm:w-auto text-center bg-[#F37272] hover:bg-[#E05F5F] border border-[#E05F5F] px-4 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* LISTA DE TORNEIOS PARTICIPANDO */}
      <div className="flex flex-col gap-4 mt-8">
        <h2 className="text-lg font-bold mb-2">Torneios Participando</h2>
        {participando.length === 0 ? (
          <p className="text-center opacity-60">Você não está participando de nenhum torneio</p>
        ) : (
          participando.map((t) => (
            <article
              key={t.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
            >
              <img src={modeImage(t.modo)} className="w-10 h-10" alt={t.modo} />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{t.nome}</h3>
                <p className="text-sm opacity-80">
                  Modo: <span className="font-semibold">{t.modo}</span>
                </p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </p>
                {(() => {
                  const status = statusInfo(t);
                  return <span className={status.className}>{status.label}</span>;
                })()}
              </div>

              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:justify-end sm:items-center">
                <Link
                  href={`/torneios/${t.id}`}
                  className="w-full sm:w-auto text-center bg-[#4CCB8A] hover:bg-[#3FB479] border border-[#3FB479] px-4 py-2 rounded-lg text-sm font-semibold text-white"
                >
                  Acessar
                </Link>
                {/* Sem editar/apagar/compartilhar para torneios apenas participando */}
                <button
                  onClick={() => sairDoTorneio(t)}
                  className="w-full sm:w-auto text-center bg-[#F37272] hover:bg-[#E05F5F] border border-[#E05F5F] px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={((t._count?.partidas ?? 0) > 0) && !t.finalizado}
                >
                  Sair
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
