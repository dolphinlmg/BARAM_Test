import { css } from '@emotion/react';
import { Theme } from '../../styles/theme';
import { GLOBAL_COLOR } from '../../utils/color';

export const style = {
  parent: css`
    user-select: none;
    position: relative;
    width: 777px;
  `,
  container: (theme: Theme, win: boolean, expand: boolean) => css`
    position: relative;
    display: flex;
    justify-content: space-between;
    height: 120px;
    width: 777px;
    background-color: ${win ? theme.blue4 : theme.red4};
    border-radius: 10px 10px ${expand ? 0 : 10}px 10px;
    color: ${theme.background};
    * {
      box-sizing: border-box;
      overflow: hidden;
    }
  `,
  gameSummary: css`
    position: relative;
    height: 120px;
    overflow: hidden;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `,
  gameSummaryContainer: css`
    flex-grow: 1;
  `,
  header: (theme: Theme, win: boolean, expand: boolean) => css`
    width: 70px;
    height: 100%;
    border-radius: 10px 0 0 ${expand ? 0 : 10}px;
    font-size: 11px;
    padding: 8px 6px;
    background-color: ${win ? theme.blue3 : theme.red2};
  `,
  expand: css`
    width: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: end;
  `,
  bottomRight: css`
    position: absolute;
    right: 0;
    bottom: 0;
  `,
  front: css`
    z-index: 1;
  `,
  level: css`
    background-color: #000000ce;
    width: 20px;
    line-height: 20px;
    border-radius: 50%;
    font-size: 9px;
    vertical-align: middle;
    text-align: center;
  `,
  middle: css`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  `,
  item: css`
    float: left;
    position: relative;
  `,
  headerTitle: css`
    font-weight: bold;
    font-size: 15px;
  `,
  summary: css`
    position: relative;
    display: block;
    margin-bottom: 3px;
    height: 60px;
    & > * {
      margin-right: 3px;
      position: relative;
      display: block;
      float: left;
    }
  `,
  kdaContainer: css`
    margin: 0;
    float: none;
  `,
  kda: css`
    font-weight: bold;
    font-size: 15px;
    text-align: center;
    display: block;
    color: black;
    * {
      display: inline;
    }
    p {
      color: red;
    }
  `,
  kdaverage: css`
    margin-block: 0;
    font-weight: bold;
    text-align: center;
    display: block;
    font-size: 14px;
    color: grey;
  `,
  seperator: css`
    background-color: #cccccc;
    width: 1px;
    border-radius: 1px;
    height: 98px;
  `,
  champion: css`
    font-size: 0px;
  `,
  stickLeft: css`
    position: absolute;
    left: 0;
  `,
  downArrow: (isExpanded: boolean) => css`
    margin: auto;
    margin-bottom: 15px;
    transform: rotate(${isExpanded ? '180deg' : '0deg'});
  `,
};

export const detailStyle = {
  tableContainer: (theme: Theme, teamId: 100 | 200, win: boolean) => css`
    width: 100%;
    background-color: ${win ? theme.blue4 : theme.red4};
    border-collapse: collapse;
    text-align: center;
    table-layout: fixed;
    border-radius: 0 0 ${teamId === 200 ? '10px 10px' : '0 0'};
    thead {
      background-color: ${theme.neutral};
      font-size: 12px;
    }
    th {
      height: 22px;
    }
  `,
  thFirst: (theme: Theme, win: boolean) => css`
    text-align: left;
    color: ${theme.foreground};
    span {
      color: ${win ? theme.blue2 : theme.red2};
    }
    width: 20%;
  `,
  width: (width: string) => css`
    width: ${width};
  `,
  container: css`
    position: relative;
    height: 33px;
    * {
      box-sizing: border-box;
      overflow: hidden;
    }
  `,
  middle: css`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  `,
  champion: css`
    margin-left: 2px;
    float: left;
    font-size: 0;
    position: relative;
  `,
  level: css`
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #000000ce;
    color: white;
    width: 15px;
    line-height: 15px;
    border-radius: 50%;
    font-size: 9px;
    vertical-align: middle;
    text-align: center;
  `,
  name: css`
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 4px;
    line-height: 33px;
    font-size: 12px;
    a {
      text-decoration: none;
      color: black;
    }
    & > span {
      font-size: 11px;
      background-color: ${GLOBAL_COLOR.mediumPurple};
      color: ${GLOBAL_COLOR.white};
      padding-left: 4px;
      padding-right: 4px;
      margin-right: 2px;
      border-radius: 16.5px;
    }
  `,
  summonerSettings: css`
    padding-bottom: 0;
    & > div {
      height: 33px;
      margin: auto;
    }
    & > div > div {
      display: inline-block;
    }
  `,
  runes: css`
    margin-left: 1px;
    margin-top: -1px;
    font-size: 0;
    & > * {
      display: block;
      margin-top: 1px;
    }
  `,
  kdaContainer: css`
    margin: 0;
    float: none;
  `,
  kda: css`
    font-size: 11px !important;
    font-weight: bold;
    text-align: center;
    display: block;
    color: black;
    * {
      display: inline;
    }
    p {
      color: red;
    }
  `,
  kdaverage: css`
    margin-block: 0;
    font-weight: bold;
    text-align: center;
    display: block;
    font-size: 10px;
    color: #383838;
  `,
  percentage: css`
    text-align: center;
    & > div {
      display: inline-block;
    }
  `,
  visible: (visible: boolean) => css`
    display: ${visible ? 'block' : 'none'};
  `,
  visibleInline: (visible: boolean) => css`
    display: ${visible ? 'inline' : 'none'};
  `,
};
