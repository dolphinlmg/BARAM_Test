import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_PATH;

if (!BASE_URL) throw new Error('API Base url이 없습니다.');

export const defaultAxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const getSummonerProfile = async (
  summonerName: string,
): Promise<SummonerProfileResponse> => {
  return await (
    await defaultAxiosInstance.get(`/summoners/${summonerName}`)
  ).data;
};

export const fetchSummonerProfile = async (
  summonerName: string,
): Promise<SummonerProfileResponse> => {
  await defaultAxiosInstance.post(`/summoners/${summonerName}`);
  return await getSummonerProfile(summonerName);
};

export const getSummonerMatchIds = async (
  puuid: string,
  after?: number,
): Promise<SummonerMatchIdsResponse> => {
  return (
    await defaultAxiosInstance.get(`/matches/by-puuid/${puuid}${after ? `?after=${after}` : ''}`)
  ).data;
};

export const requestFetchSummonerMatches = async (
  puuid: string,
  after?: number,
): Promise<number> => {
  return (
    await defaultAxiosInstance.post(`/matches/by-puuid/${puuid}${after ? `?after=${after}` : ''}`)
  ).status;
};

export const getMatch = async (matchId: string): Promise<MatchResponse> => {
  return await (
    await defaultAxiosInstance.get(`/matches/${matchId}`)
  ).data;
};
