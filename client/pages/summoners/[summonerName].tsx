import { css } from '@emotion/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Button from '../../components/Button';
import GameSlot from '../../components/GameSlot';
import Logo from '../../components/Logo';
import SearchBar from '../../components/SearchBar';
import SummonerProfileCard from '../../components/SummonerProfileCard';
import SummonerStatCard from '../../components/SummonerStatCard';
import {
  getMatch,
  getScoreMultipliers,
  getSummonerMatchIds,
  getSummonerProfile,
  requestFetchSummonerMatches,
  tryToGetSummonerProfile,
} from '../../utils/api';
import {
  calculateContributionRanks,
  getMatchStatistic,
  getTotalMatchStatistics,
  MatchStatistic,
  TotalStatistic,
} from '../../utils/matchStatistic';

const defaultTotalStatistics = getTotalMatchStatistics({});

interface SummonerProfilePanelProps {
  summonerName: string;
  setSummonerNotFound: Dispatch<SetStateAction<boolean>>;
}

const style = {
  header: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 128px;
    padding-top: 24px;
    padding-bottom: 24px;
  `,
  aside: css`
    position: relative;
    left: calc(50% - 370px);
    top: 0;
    height: 400px;
    width: 265px;
    transform: translate(-100%);
    padding-right: 24px;
  `,
  profile: css`
    display: flex;
    justify-content: space-between;
    width: calc(265px + 777px + 24px);
    margin: auto;
    transform: translate(-144px);
  `,
  textAlignCenter: css`
    text-align: center;
  `,
  main: css`
    width: 777px;
    display: block;
    position: relative;
    margin: 0 auto;
    & > * {
      margin: 10px 0 0 0;
    }
  `,
  summonerNotFound: css`
    font-size: 20px;
    text-align: center;
  `,
};

export default function SearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>('');
  const [summonerName, setSummonerName] = useState<string>('');
  const [summonerNotFound, setSummonerNotFound] = useState<boolean>(false);

  const handleSearch = () => {
    if (searchText === '') return;
    router.push(`/summoners/${searchText}`);
  };

  useEffect(() => {
    const query = router.query;
    if (typeof query.summonerName === 'string') {
      setSummonerName(query.summonerName);
      setSearchText(query.summonerName);
    }
  }, [router.isReady, router.query]);
  return (
    <>
      <header css={style.header}>
        <Logo width={221} />
        <SearchBar text={searchText} setText={setSearchText} onSearchButtonClick={handleSearch} />
      </header>
      {summonerNotFound ? (
        <p css={style.summonerNotFound}>소환사가 없습니다.</p>
      ) : (
        <SummonerProfilePanel
          summonerName={summonerName}
          setSummonerNotFound={setSummonerNotFound}
        />
      )}
    </>
  );
}

function SummonerProfilePanel({ summonerName, setSummonerNotFound }: SummonerProfilePanelProps) {
  const [summonerProfile, setSummonerProfile] = useState<SummonerProfile | null>(null);
  const [matchIds, setMatchIds] = useState<SummonerMatchIds>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchStatistics, setMatchStatistics] = useState<{ [key: string]: MatchStatistic }>({});
  const [totalStatistics, setTotalStatistics] = useState<TotalStatistic | null>(null);
  const [fetching, setFetching] = useState<Date | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [scoreMultipliers, setScoreMultipliers] = useState<Contribution | null>(null);

  useEffect(() => {
    async function tick() {
      const newSummonerProfile = await getSummonerProfile(summonerName);
      if (fetching != newSummonerProfile.updatedAt) {
        setSummonerProfile(newSummonerProfile);
        const lastMatchId = matches.length ? matches[matches.length - 1].info.gameId : 0;

        const newMatchIds = (
          await getSummonerMatchIds(newSummonerProfile.puuid, lastMatchId)
        ).matchIds.filter((id) => matchIds.indexOf(id) === -1);

        setMatchIds(newMatchIds);
        setLoadMore(false);
      }
    }

    if (loadMore) {
      const timer = setInterval(tick, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [loadMore, summonerName, matchIds, matches, fetching]);

  useEffect(() => {
    async function tick() {
      const newSummonerProfile = await getSummonerProfile(summonerName);
      if (fetching != newSummonerProfile.updatedAt) {
        setSummonerProfile(newSummonerProfile);
        setMatches([]);
        setMatchIds((await getSummonerMatchIds(newSummonerProfile.puuid)).matchIds);
        setUpdate(false);
      }
    }

    if (update) {
      const timer = setInterval(tick, 1000);
      return () => clearInterval(timer);
    }
  }, [update, summonerName, fetching]);

  // on summoner change
  useEffect(() => {
    // reset previous summoner data
    setUpdate(false);
    setLoadMore(false);
    setFetching(null);
    setTotalStatistics(defaultTotalStatistics);
    setSummonerProfile(null);
    setMatchIds([]);
    setMatches([]);
    setMatchStatistics({});

    if (!summonerName) return;

    (async () => {
      try {
        const newSummonerProfile = await tryToGetSummonerProfile(summonerName);
        setSummonerProfile(newSummonerProfile);
        setMatchIds((await getSummonerMatchIds(newSummonerProfile.puuid)).matchIds);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === axios.HttpStatusCode.NotFound) {
          setSummonerNotFound(true);
        }
      }
    })();

    (async () => {
      setScoreMultipliers(await getScoreMultipliers());
    })();
  }, [setSummonerNotFound, summonerName]);

  useEffect(() => {
    if (matchIds.length === 0 || !scoreMultipliers) return;

    const promises = matchIds.map(async (matchId) => {
      const match = await getMatch(matchId);
      calculateContributionRanks(match, scoreMultipliers);
      return match;
    });

    (async () => {
      try {
        const newMatches = await Promise.all(promises);
        setMatches((matches) => [...matches, ...newMatches]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [matchIds, scoreMultipliers]);

  useEffect(() => {
    if (!summonerProfile || matches.length === 0) return;

    // sort
    matches.sort((a: Match, b: Match) => {
      return a.info.gameCreation < b.info.gameCreation ? 1 : -1;
    });

    setMatchStatistics(
      matches.reduce((acc, match) => {
        const newAcc: { [index: string]: MatchStatistic } = { ...acc };
        if (newAcc[match.metadata.matchId]) return newAcc;

        newAcc[match.metadata.matchId] = getMatchStatistic(match, summonerProfile?.puuid);
        return newAcc;
      }, {}),
    );
  }, [matches, summonerProfile]);

  useEffect(() => {
    if (matchStatistics) {
      setTotalStatistics(getTotalMatchStatistics(matchStatistics));
    }
    setFetching(null);
  }, [matchStatistics]);

  // before loading router
  if (!summonerName) return <></>;

  // before fetching summoner info
  if (!summonerProfile || !totalStatistics) return <p css={style.textAlignCenter}>...</p>;

  const { winRate, kda, camp, gameContribution } = totalStatistics;

  return (
    <>
      <div css={style.profile}>
        <SummonerProfileCard
          profileIconId={summonerProfile.profileIconId}
          summonerName={summonerProfile.name}
          summonerLevel={summonerProfile.level}
          modifiedAt={new Date(summonerProfile.updatedAt).getTime()}
          challenges={summonerProfile.challenges}
          onClick={async () => {
            try {
              setFetching((await requestFetchSummonerMatches(summonerProfile.puuid)).startedAt);
              setUpdate(true);
            } catch (e) {
              console.error(e);
              setUpdate(false);
              setFetching(null);
            }
          }}
          fetching={fetching !== null}
        />
        <SummonerStatCard
          winRate={winRate}
          kda={kda}
          camp={camp}
          gameContribution={gameContribution}
        />
      </div>
      <main css={style.main}>
        {matches.map((match, idx) => (
          <GameSlot
            key={`gameSlot-${match.info.gameId}-${idx}`}
            matchData={match}
            puuid={summonerProfile.puuid}
          />
        ))}
        {matches.length !== 0 && (
          <Button
            width={'100%'}
            enabled={!fetching}
            onClick={async () => {
              try {
                setFetching(
                  (
                    await requestFetchSummonerMatches(
                      summonerProfile.puuid,
                      Math.floor(matches[matches.length - 1].info.gameCreation / 1000),
                    )
                  ).startedAt,
                );
                setLoadMore(true);
                return;
              } catch (e) {
                console.error(e);
              }

              try {
                // get matches from local (fallback)
                const lastMatchId = matches.length ? matches[matches.length - 1].info.gameId : 0;
                const newMatchIds = (
                  await getSummonerMatchIds(summonerProfile.puuid, lastMatchId)
                ).matchIds.filter((id) => matchIds.indexOf(id) === -1);
                setMatchIds(newMatchIds);
              } catch (e) {
                console.error(e);
              } finally {
                setLoadMore(false);
                setFetching(null);
              }
            }}
          >
            {fetching ? '...' : '더보기'}
          </Button>
        )}
      </main>
    </>
  );
}
