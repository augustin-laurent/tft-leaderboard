import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/styles.css';
import playersData from '../assets/players.json';

const TFTTable = () => {
  const rankOrder = {
    "challenger i": 1,
    "grandmaster i": 2,
    "master i": 3,
    "diamond i": 4,
    "diamond ii": 5,
    "diamond iii": 6,
    "diamond iv": 7,
    "platinum i": 8,
    "platinum ii": 9,
    "platinum iii": 10,
    "platinum iv": 11,
    "gold i": 12,
    "gold ii": 13,
    "gold iii": 14,
    "gold iv": 15,
    "silver i": 16,
    "silver ii": 17,
    "silver iii": 18,
    "silver iv": 19,
    "bronze i": 20,
    "bronze ii": 21,
    "bronze iii": 22,
    "bronze iv": 23,
    "iron i": 24,
    "iron ii": 25,
    "iron iii": 26,
    "iron iv": 27,
  };

  const [players, setPlayers] = useState(playersData);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [apiCalls, setApiCalls] = useState({});

  const fetchPlayerData = async (user) => {
    try {
      const ranking = await axios.get(
        'https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/' + user.id + '?api_key=' + process.env.REACT_APP_RIOT_API
      );

      if (ranking.data[0]) {
        const data = ranking.data[0];
        const playerData = {
          winrate: ((data.wins / (data.losses + data.wins)) * 100).toFixed(2) + '%',
          nbPartie: data.losses + data.wins,
          win: data.wins,
          rank: ranking.data[0].tier + ' ' + ranking.data[0].rank,
          loose: data.losses,
          leaguePoints: data.leaguePoints,
          position: user.position,
        };

        return playerData;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données des joueurs:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const newUsers = [...players];
      const newApiCalls = { ...apiCalls };

      for (let i = 0; i < newUsers.length; i++) {
        const user = newUsers[i];
        if (!newApiCalls[user.id]) {
          const playerData = await fetchPlayerData(user);
          if (playerData) {
            newUsers[i] = { ...user, ...playerData };
          }
          newApiCalls[user.id] = true;
        }
      }

      newUsers.sort((a, b) => {
        const rankA = rankOrder[a.rank.toLowerCase()] || Infinity;
        const rankB = rankOrder[b.rank.toLowerCase()] || Infinity;
        return rankA - rankB;
      });

      newUsers.forEach((player, index) => {
        player.position = index + 1;
      });

      setPlayers(newUsers);
      setApiCalls(newApiCalls);
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSort = (column) => {
    // Vérifie si la colonne de tri est déjà active
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Inverse l'ordre de tri
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const compareValues = (a, b) => {
    if (sortColumn == 'rank') {
      if (rankOrder[a[sortColumn].toLowerCase()] < rankOrder[b[sortColumn].toLowerCase()]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (rankOrder[a[sortColumn].toLowerCase()] > rankOrder[b[sortColumn].toLowerCase()]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      if (a[sortColumn] < b[sortColumn]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    }
  };

  useEffect(() => {
    const sortedPlayers = players.slice().sort(compareValues);
    setFilteredPlayers(sortedPlayers);
  }, [players, sortColumn, sortOrder]);

  return (
    <div>
      <div className="flex flex-col h-screen justify-center items-center my-auto">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-slate-900 text-slate-50">
            <thead>
              <tr>
                <th onClick={() => handleSort('position')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'position' ? `sorted-${sortOrder}` : ''}`}>
                  Position
                  {sortColumn === 'position' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
                <th className="border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12">
                  Nom
                </th>
                <th className="border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12">
                  Compte
                </th>
                <th onClick={() => handleSort('rank')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'rank' ? `sorted-${sortOrder}` : ''}`}>
                  Rang
                  {sortColumn === 'rank' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>

                <th onClick={() => handleSort('lp')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'lp' ? `sorted-${sortOrder}` : ''}`}>
                  LP
                  {sortColumn === 'lp' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>

                <th onClick={() => handleSort('nbPartie')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'nbPartie' ? `sorted-${sortOrder}` : ''}`}>
                  Nombre de parties
                  {sortColumn === 'nbPartie' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>

                <th onClick={() => handleSort('win')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'win' ? `sorted-${sortOrder}` : ''}`}>
                  Victoire
                  {sortColumn === 'win' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>

                <th onClick={() => handleSort('loose')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'loose' ? `sorted-${sortOrder}` : ''}`}>
                  Défaite
                  {sortColumn === 'loose' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>

                <th onClick={() => handleSort('winrate')} className={`border text-lg font-bold px-4 py-2 md:w-1/6 lg:w-1/12 hover:text-teal-400 hover:cursor-pointer ${sortColumn === 'winrate' ? `sorted-${sortOrder}` : ''}`}>
                  Taux de victoire
                  {sortColumn === 'winrate' && <span className={`arrow-${sortOrder === 'asc' ? 'up' : 'down'}`} />}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="border px-4 py-2">{player.position}</td>
                  <td className="border px-4 py-2">{player.name}</td>
                  <td className="border px-4 py-2">{player.account}</td>
                  <td className="border px-4 py-2">{player.rank}</td>
                  <td className="border px-4 py-2">{player.leaguePoints}</td>
                  <td className="border px-4 py-2">{player.nbPartie}</td>
                  <td className="border px-4 py-2">{player.win}</td>
                  <td className="border px-4 py-2">{player.loose}</td>
                  <td className="border px-4 py-2">{player.winrate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
};

export default TFTTable;