import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from '@tanstack/react-router'; // Replace with TanStack Router hook

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
}

const fetchCharacterDetails = async (id: string): Promise<Character> => {
  const { data } = await axios.get<Character>(`https://rickandmortyapi.com/api/character/${id}`);
  return data;
};

const CharacterDetails = () => {
  const { characterId } = useParams({ from: '/character/$characterId' }); // Get characterId from URL parameters
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => fetchCharacterDetails(characterId),
  });

  if (isLoading) return <p>Loading character details...</p>;
  if (isError) return <p>Error: {error?.message}</p>;
  if (!data) return <p>Character not found.</p>;

  return (
    <div>
      <h1>{data.name}</h1>
      <img src={data.image} alt={data.name} />
      <p>Status: {data.status}</p>
      <p>Species: {data.species}</p>
      <p>Gender: {data.gender}</p>
      <p>Origin: {data.origin.name}</p>
      <p>Last known location: {data.location.name}</p>
    </div>
  );
};

export default CharacterDetails;