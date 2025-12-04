export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          MotoGP Betting Platform
        </h1>
        <p className="text-center text-lg mb-8">
          Welcome to the MotoGP prediction and betting system for friends.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="rounded-lg border border-transparent px-5 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            Login
          </a>
          <a
            href="/leaderboard"
            className="rounded-lg border border-transparent px-5 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            View Leaderboard
          </a>
        </div>
      </div>
    </main>
  );
}
