export enum StatType {
    /**
     * Pass type.
     */
    PASS = 'passOk',
    /**
     * Game system type.
     */
    GAME_SYSTEM = 'gameSystem',
    /**
     * Ground type.
     */
    GROUND = 'ground',
    /**
     * Goal target type.
     */
    GOAL_TARGET = 'goalTarget',
    /**
     * Action type.
     */
    ACTION = 'action',
    /**
     * Dead time type.
     */
    DEAD_TIME = 'deadTime',
    /**
     * Switch phase type.
     */
    SWITCH_PHASE = 'switchPhase',
    /**
     * Outside type.
     */
    OUTSIDE = 'outside',
    /**
     * Goal scored type.
     */
    GOAL_SCORED = 'goalScored',
    /**
     * Goal conceded type.
     */
    GOAL_CONCEDED = 'goalConceded',
    /**
     * Impact shood def type.
     */
    IMPACT_SHOOD_DEF = 'impactShootDef',
    /**
     * Impact shood att type.
     */
    IMPACT_SHOOD_ATT = 'impactShootAtt',
    /**
     * Wound type.
     */
    WOUND = 'wound',
    /**
     * Stop shoot type.
     */
    STOP_SHOOT = 'stopOk',
    /**
     * Pole type.
     */
    POLE = 'pole',
    /**
     * Holder type.
     */
    HOLDER = 'holder',
    /**
     * Position type type.
     */
    POSITION_TYPE = 'positionType',
    /**
     * Substitue type.
     */
    SUBSTITUE = 'substitue',
    /**
     * Play time type.
     */
    PLAY_TIME = 'playTime',
    /**
     * Total play time type.
     */
    TOTAL_PLAY_TIME = 'totalPlayTime',
    /**
     * Red card type.
     */
    RED_CARD = 'redCard',
    /**
     * Yellow card type.
     */
    YELLOW_CARD = 'yellowCard',
    /**
     * Orange card type.
     */
    ORANGE_CARD = 'exclTmp',
    
    stopGKDef = 'stopGKDef',
    stopGKAtt = 'stopGKAtt'
}