
import CardNavigation from "../components/card-navigation";
import ImagesCarousel from "../components/images-carousel";
import NavBar from "../components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden relative">
        <main className="flex-1 px-4 py-10 flex flex-col gap-9">
          <ImagesCarousel 
            title="Bem-vindo ao Clube Xeque Mate de Iguatu"
            description="Seu espaço para interagir e praticar xadrez com seus amigos"
          />
          <CardNavigation
            image_url="/throphy.png"
            title="Torneios do clube"
            description="Participe dos torneios presenciais e online do clube, com emparelhamentos equilibrados e sistema de desempate próprio."
            navigate_to="/tournaments"
          />
          <CardNavigation
            image_url="/goal.png"
            title="Exercícios práticos"
            description="Aqui você pode exercitar suas habilidades de todas as etapas de uma partida de xadrez, como táticas, aberturas e finais de jogo."
            navigate_to="/practice"
          />
        </main>
        <NavBar />
      </div>
  );
}
