export class StatsContainerModel {

    /**
     * Type container (EVENT, PLAYER, TEAM)
     */
    type: string = '';

    /**
     * Id owner container
     */
    onwerId: string = '';

    /**
     * Collect's informations
     */
    collectList: any[] = [];

    /**
     * Team's informations
     */
    teamList: any[] = [];

    /**
     * List of player selected for the event
     */
    playerList: any[] = [];

    /**
     * list of stats for event
     */
    statList: any[] = [];
}