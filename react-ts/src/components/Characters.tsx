import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from '@tanstack/react-router';

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharacterApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

const fetchCharacters = async (page: number): Promise<CharacterApiResponse> => {
  const { data } = await axios.get<CharacterApiResponse>(
    `https://rickandmortyapi.com/api/character?page=${page}`,
  );
  return data;
};

const columnHelper = createColumnHelper<Character>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: () => 'Name',
    cell: (info) => <Link to="/character/$characterId" params={{ characterId: info.row.original.id }}>{info.getValue()}</Link>,
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('species', {
    header: () => 'Species',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('image', {
    header: () => 'Image',
    cell: (info) => <img src={info.getValue()} alt={info.row.original.name} width={50} height={50} />,
  }),
];

const Characters = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    // keepPreviousData: true, // Keep previous data while fetching new page
  });

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading characters...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  const handleRefresh = () => {
    refetch()
  }
  
  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {data?.info.pages}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={!data?.info.next}>
          Next
        </button>
        <button onClick={handleRefresh}>
          Refresh Data
      </button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {data?.info.pages}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={!data?.info.next}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Characters;
