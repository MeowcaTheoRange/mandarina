import { MandarinaPlugin } from "../types";
import { createAction } from "../chapters";
import { layers } from "../constants";

export function showCharacter(
    this: MandarinaPlugin,
    characterId: string,
    expression = "default",
    align = "center",
) {
    const k = this.k;

    return createAction({
        id: "show_character",
        autoskip: true,
        exec: () => {
            const character = this.data.characters.get(characterId);
            if (!character) throw new Error(`Character with id "${characterId}" does not exist.`);

            const expressionSprite = character.opt?.expressions?.[expression];
            if (!expressionSprite) throw Error(`Expression "${expression}" does not exist.`);

            // k.debug.log(`Showing character "${characterId}" with expression "${expression}" aligned to "${align}".`);

            const height = expressionSprite.height ?? character.opt?.height ?? k.height();
            const alignments = {
                "left": [
                    k.pos(k.width() * 0.25, height),
                ],
                "center": [
                    k.pos(k.center().x, height),
                ],
                "right": [
                    k.pos(k.width() * 0.75, height),
                ],
            };

            // Create character
            let charobj = k.get("character_" + characterId, { recursive: true })[0];
            const sprite = expressionSprite.sprite ?? character.opt?.sprite;
            const anim = expressionSprite.anim ?? (character.opt?.anim ?? undefined);

            if (charobj) {
                if (sprite) charobj.use(k.sprite(sprite, {
                    anim: anim,
                    frame: expressionSprite.frame ?? 0,
                }));
            } else {
                charobj = k.add([
                    ...alignments[align],
                    k.z(layers.characters),
                    k.anchor("bot"),
                    sprite ? k.sprite(sprite, {
                        anim: anim,
                        frame: expressionSprite.frame ?? 0,
                    }) : "",
                    k.opacity(0),
                    "character_" + characterId,
                ]);
                k.tween(0, 1, 0.5, (x=>charobj.opacity=x), k.easings.easeInQuad);
            }
            const posy = charobj.pos.y;
            k.tween(posy, posy + 20, 0.1, (x=>charobj.pos.y=x), k.easings.easeInQuad)
                .then(() =>
                    k.tween(posy + 20, posy, 0.1, (x=>charobj.pos.y=x), k.easings.easeOutQuad),
                );
        },
    });


}

export function hideCharacter(
    this: MandarinaPlugin,
    characterId: string,
) {
    const k = this.k;

    return createAction({
        id: "hide_character",
        autoskip: true,
        exec: () => {
            const charobj = k.get("character_" + characterId, { recursive: true })[0];
            k.tween(1, 0, 0.5, (x=>charobj.opacity=x), k.easings.easeInQuad)
                .then(() => charobj.destroy());
        },
    });
}
