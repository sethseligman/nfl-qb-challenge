import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { ScoreHistory } from '../components/ScoreHistory';

interface GameHistory {
  id: string;
  date: Date;
  totalScore: number;
  tier: string;
  picks: Array<{
    team: string;
    qb: string;
    wins: number;
  }>;
}

export function MyGames() {
  const { user } = useAuth();
  const [games, setGames] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return;

      try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const gamesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        })) as GameHistory[];

        setGames(gamesData.sort((a, b) => b.date.getTime() - a.date.getTime()));
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Games</h1>
      {games.length === 0 ? (
        <p className="text-gray-600">No games played yet. Start a new game!</p>
      ) : (
        <ScoreHistory scores={games} />
      )}
    </div>
  );
} 