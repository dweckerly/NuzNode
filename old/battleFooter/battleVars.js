const mod = 0.1;
const minModCount = -6;
const maxModCount = 6;
const crtEvaAccMod = 10;
const baseInterval = 1500;

var turn;
var rounds = 0;
var endFight = false;

var playerAction;
var playerMoveId;
var playerSwicthMonId;
var playerUseItemId;

var opponentAction;
var opponentMoveId;
var opponentSwitchMonId;
var opponentUseItemId;

var playerMods = {
    'atk': { 'mod': 1, 'count': 0 },
    'def': { 'mod': 1, 'count': 0 },
    'sAtk': { 'mod': 1, 'count': 0 },
    'sDef': { 'mod': 1, 'count': 0 },
    'speed': { 'mod': 1, 'count': 0 },
    'acc': { 'mod': 1, 'count': 0 },
    'crit': { 'mod': 1, 'count': 0 },
    'evasion': { 'mod': 1, 'count': 0 }
}

var opponentMods = {
    'atk': { 'mod': 1, 'count': 0 },
    'def': { 'mod': 1, 'count': 0 },
    'sAtk': { 'mod': 1, 'count': 0 },
    'sDef': { 'mod': 1, 'count': 0 },
    'speed': { 'mod': 1, 'count': 0 },
    'acc': { 'mod': 1, 'count': 0 },
    'crit': { 'mod': 1, 'count': 0 },
    'evasion': { 'mod': 1, 'count': 0 }
}

var atkMon;
var atkMonMove;
var atkMonMods;
var atkMonHealth;
var atkMonStatus;
var defMon;
var defMonMove;
var defMonMods;
var defMonHealth;
var defMonStatus;

var segments
var roundSegs = {};
var segIndex = 0;
var segInterval = 2000;