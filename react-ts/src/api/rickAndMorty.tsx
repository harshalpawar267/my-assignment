import axios from 'axios';

const BASE_URL = "https://rickandmortyapi.com/api";

export const fetchCharacters = async (page: number) => {
    const res = await axios.get(`${BASE_URL}/character?page=${page}`)
    return res.data;
}

export const fetchCharactersById = async (id: string) => {
    const res = await axios.get(`${BASE_URL}/character/${id}`)
    return res.data;
}