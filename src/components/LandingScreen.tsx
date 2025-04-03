/** @jsxImportSource react */
interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6">NFL QB Challenge</h1>
        <div className="space-y-4 text-lg">
          <p>Welcome to the NFL QB Challenge! Test your knowledge of NFL quarterbacks.</p>
          <p>Rules:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You'll be given a random NFL team for each round</li>
            <li>Name a quarterback who has played for that team</li>
            <li>Each QB can only be used once</li>
            <li>Try to get the highest total wins possible!</li>
          </ul>
        </div>
        <button
          onClick={onStart}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Start Game
        </button>
      </div>
    </div>
  );
} 