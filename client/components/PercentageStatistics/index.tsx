import { useGlobalTheme } from '../../styles/GlobalThemeContext';
import Percentage from '../Percentage';
import { style } from './style';

interface PercentageStatisticsProps {
  dealtPercent: number;
  dealtAmount: number;
  healPercent: number;
  healAmount: number;
  damagedPercent: number;
  damagedAmount: number;
  deathPercent: number;
  deathAmount: number;
  percentMax?: Contribution;
  padding?: number;
  color?: ColorProps;
}

interface ColorProps {
  background: string;
  foreground: string;
}

export default function PercentageStatistics({
  dealtPercent,
  dealtAmount,
  healPercent,
  healAmount,
  damagedPercent,
  damagedAmount,
  deathPercent,
  deathAmount,
  percentMax,
  padding = 1,
  color,
}: PercentageStatisticsProps) {
  const { theme } = useGlobalTheme();
  const foreground = color?.foreground ?? theme.foreground;
  const background = color?.background ?? theme.background;

  return (
    <div css={style.container(padding)}>
      <div css={style.slot(foreground, padding)}>
        <p>딜량</p>
        <Percentage
          backgroundColor={foreground}
          foregroundColor={theme.accent1}
          textColor={background}
          percent={dealtPercent}
          maxPercent={percentMax?.dealt}
          value={dealtAmount}
        />
      </div>
      <div css={style.slot(foreground, padding)}>
        <p>힐량</p>
        <Percentage
          backgroundColor={foreground}
          foregroundColor={theme.accent1}
          textColor={background}
          percent={healPercent}
          maxPercent={percentMax?.heal}
          value={healAmount}
        />
      </div>
      <div css={style.slot(foreground, padding)}>
        <p>탱킹</p>
        <Percentage
          backgroundColor={foreground}
          foregroundColor={theme.accent1}
          textColor={background}
          percent={damagedPercent}
          maxPercent={percentMax?.damaged}
          value={damagedAmount}
        />
      </div>
      <div css={style.slot(foreground, padding)}>
        <p>데스</p>
        <Percentage
          backgroundColor={foreground}
          foregroundColor={theme.red3}
          textColor={background}
          percent={deathPercent}
          maxPercent={percentMax?.death}
          value={deathAmount}
        />
      </div>
    </div>
  );
}
