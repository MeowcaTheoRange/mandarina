import mandarina from "mandarinavn";

// We create the Mandarina game context,
// there's the init game options
const m = mandarina({
	width: 640,
});

// We define characters
m.character("dude", "Dude");

// We go to the Mandarina scene
m.k.go("mandarina_novel");