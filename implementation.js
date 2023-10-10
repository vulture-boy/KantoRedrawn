/*
*   Retro Redrawn 
*   -- Implementation Script
*
*   Frontend data container of the Redrawn Viewer. 
*   Contains implementation data specific to a Redrawn project.
*
*   by Tyson Moll (vvvvvvv), 2023.
*
*/

// Directories
var artistImgDir = "img/profiles/";
var artistImgExtension = '.png';  // Image extension for artist images.
// (having JavaScript self-determine if an image exists without a particular extension is difficult)

/** Content layers in the Redrawn */
var activeLayerIndex = 0;           // Currently active layer index (and initial index)
var redrawnLayers = [
    {
        name: "kanto",
        canvasSize: {width: 5472, height: 5904},
        areas: kantoAreas
    },
    {
        name: "interior",
        canvasSize: {width: 5504, height: 5744},
        areas: interiorAreas
    },
    {
        name: "sevii",
        canvasSize: {width: 4448, height: 6784},
        areas: seviiAreas
    },
];

/** Biome Data (Screen icons) */
var biomes = [
    {
        name: "Town",
        ident: "town",
        iconId: "location_city",
        color: 'rgb(130 94 108)',
    },
    {
        name: "Forest",
        ident: "forest",
        iconId: "park",
        color: 'rgb(94 130 105)',
    },
    {
        name: "Surfing",
        ident: "surfing",
        iconId: "surfing",
        color: 'rgb(108 127 171)',
    },
    {
        name: "Mountain",
        ident: "mountain",
        iconId: "landscape",
        color: 'rgb(130 115 88)',
    },
    {
        name: "Route",
        ident: "route",
        iconId: "pedal_bike",
        color: 'rgb(110 130 88)',
    },
];
