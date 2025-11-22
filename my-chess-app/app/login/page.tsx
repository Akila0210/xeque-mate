"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/background-image.png')]">
      <div className="w-full max-w-md p-12">
        <div className="flex justify-center mb-4">
          <Image
            src="/xequeLogo.jpg"
            className="object-cover rounded-full"
            alt="Logo"
            width={120}
            height={120}
          />
        </div>
        <h1 className="text-2xl mb-2 text-center text-white">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              className="w-full mt-1 p-3 bg-[#F5F8FA] border border-neutral-400 rounded-[4px] focus:outline-none focus:ring-1 text-[10px]"
              placeholder="Nome"
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full mt-1 p-3 bg-[#F5F8FA] border border-neutral-400 rounded-[4px] focus:outline-none focus:ring-1 text-[10px]"
              placeholder="Senha"
            />
          </div>
          <div className="mt-12 space-y-4">
            <button
              type="submit"
              className="w-full p-3 bg-[#6BAAFD] text-white rounded-sm border-b-4 border-[#5C9CF0] text-xs font-bold hover:bg-[#1E50A4] hover:border-[#152E59] transition"
            >
              Entrar
            </button>
            <label className="text-xs font-bold flex justify-center text-white">
              Não possui conta?
            </label>
            <Link
              href="/registrar"
              className="w-full p-3 block text-center bg-[#5AC0CB] text-white rounded-sm border-b-4 border-[#348C95] text-xs font-bold hover:bg-[#49a9b2] transition"
            >
              Cadastrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
