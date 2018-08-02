var player = {};
var eventVar;
var state = 'intro';

var states = ["intro", "wander", "speaking", "event", "naming", "location"]

const ranch = { x: 1197, y: 562, w: 91, h: 80, name: 'Ranch', hover: false, id: 1 };
const forest = { x: 1374, y: 690, w: 110, h: 100, name: 'Forest', hover: false, id: 2 };
const lake = { x: 1000, y: 736, w: 176, h: 96, name: 'Lake', hover: false, id: 3 };
const cave = { x: 958, y: 506, w: 100, h: 70, name: 'Cave', hover: false, id: 4 };
const hills = { x: 1160, y: 910, w: 100, h: 100, name: 'Hills', hover: false, id: 5 };
const hotel = { x: 530, y: 1150, w: 100, h: 100, name: 'Hotel', hover: false, id: 6 };
const lightHouse = { x: 820, y: 1450, w: 100, h: 120, name: 'Light House', hover: false, id: 7 };
const marsh = { x: 1340, y: 1176, w: 120, h: 140, name: 'Marsh', hover: false, id: 8 };

const locations = [cave, ranch, lake, forest, hills, hotel, lightHouse, marsh];

var main, sinAnim;

var wildMon, battleType;
