import { useNavigate } from "@tanstack/react-router";

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate({ to: "/game" });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[var(--background)]">
      <h1 className="text-6xl font-bold text-[var(--foreground)] mb-4">
        Everyone is fine
      </h1>
      <p className="text-xl text-[var(--foreground-muted)] mb-12">
        The narrator may have lied
      </p>
      <button
        type="button"
        onClick={handleStartGame}
        className="px-8 py-4 text-lg font-semibold text-[var(--button-foreground)] bg-[var(--button-background)] rounded-lg hover:bg-[var(--button-background-hover)] transition-colors cursor-pointer"
      >
        Start Game
      </button>
    </div>
  );
};
