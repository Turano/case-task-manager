"use client";

import { useEffect, useState } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col gap-4 max-w-xl mx-auto my-auto">
      <h1 className="text-2xl font-bold text-center">Algo deu errado</h1>

      <p className="text-center">Não foi possível carregar a página.</p>

      <p className="text-center text-red-600">
        Descrição do erro: {error.message}
      </p>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        onClick={() => {
          reset();
        }}
      >
        Tentar novamente
      </button>
    </section>
  );
}
