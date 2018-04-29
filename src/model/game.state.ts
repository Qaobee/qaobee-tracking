import { StatType } from './stat.type';
import { InGamePlayer } from './ingame.player';
export class GameState {
    eventId: string ='';
    positions: any = {};
    chrono: number = 0;
    currentPhase: number = 1;
    playerList: Array<InGamePlayer> = [];
    homeScore: number = 0;
    visitorScore: number = 0;
    homeTimeout: number = 0;
    visitorTimeout: number = 0;
    sanctions: { playerId: string, sanction: StatType, time: number, position: string, done: boolean }[] = [];
    state: string = 'INIT';
    homeGameSystem: string ='';
    visitorGameSystem: string ='';
    playTimeMap: any = {};
    lastInMap: any = {};
}