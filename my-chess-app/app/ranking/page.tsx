import { getAllTimeRanking } from "../data/get-alltime-ranking";
import RankingPageClient from "./ranking-page-client";

export default async function RankingPage() {
  const allTime = await getAllTimeRanking();

  return (
    <RankingPageClient
      weekly={allTime}
      monthly={allTime}
      allTime={allTime}
    />
  );
}
