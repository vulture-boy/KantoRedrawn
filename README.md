# RETRO REDRAWN - Pokemon Redrawn

Repository for the Pokemon Redrawn project.

The base code was originally programmed by Jerky (@Hyperjerk) for the Retro Redrawn Kanto and Johto projects.
This version on GitHub was created and refactored by Tyson Moll for reuse and repurpose (https://tysonmoll.ca/), originally for Castlevania Redrawn.

Artists are credited for their work in the project website (as denoted in the areas.js file).

Official Website: https://retroredrawn.com/
Discord: https://discord.gg/ZN3297XBtU

## Creating a new Redrawn

1. Fork the repository to create your own copy
2. Setup your areas file
    * Open areas.js and change the name of the first "area" array (e.g. 'var castleAreas') to something for your project (e.g. 'var myRedrawnAreas').
    * Remove all but one of the entries inside the square braces ('[]'). Remove all other arrays.
    * This is where individual screens in the project will be defined.
    * If you wish to have additional layers, create a copy of this area array and rename it. Repeat as many times as you'd like.
    * We will add content to the individual areas in the array later.
3. Link your areas to your implementation file
    * Open implementation.js and change the contents of redrawnLayers to contain one entry per array you setup in Step 2.
    * These arrays describe details about specific redrawn layers (not old vs redrawn, but rather subjective things like outside vs inside)
    * Set the canvas size to be large enough to contain all the screens you intend to include in the project. You can readjust this later.
    * The 'areas' field shoud match the name of the array exactly as written in Step 2.
    * The name of the area is used when referencing the layer by name later on
5. In implementation.js. update the content of the biomes array with as many entries as you'd like.
    * These are used for the visual display of items in the list of redrawn screens
        * name refers to the name of the biome, formatted for reading (i.e. how you would want to read the text)
        * ident refers to the name of the biome, formatted for code (i.e. lowercase, no spaces)
        * iconId is a reference to an icon in Google Material Symbols and Icons, where icons are currently drawn from
        * color is the color of the menu icon.
    * You can update these later if you prefer 
6. Update the content of index.html to reflect your project.
    * In the Header, change the website page name, description,  OG (OpenGraph) image and favicon fields. (The OG image is the image shown in social media thumbnails)
    * Replace the (FKA) Twitter link with an authorative social media link
    * Update the Menu Logo to match your project
    * Update the About section with a description relative to your project. Please provide appropriate credit to artists and programmers involved in your project (including those you fork from) and remove the 'bug support' section unless you or an associate plan to provide support for your own project (in which case update the field accordingly). 
    * Update the loading bar image.
    * Review the contents of this page to make sure that you are content with it.
7. Update the layer buttons
    * In index.html's "areaList" div, there are list items for each layer in the project.
        * Change the name provided to the changeLayer function to the name of your layer. Set the class to the same name, and the name in the Span section to the display name.
    * In home.css, find "#layers li button.__" and replace the name of the layer with your own. Update the background image as well.
8. Add areas to the areas.js file (see below)
9. Remove any remaining project-specific image assets and replace with your own once you are done setting up the project.
    * images are stored in the img folder, where screens can be found in folders defined by the redrawnLayers names 
11. Modify home.css and any webfonts in index.html to further customize the look of your redrawn website

## Adding Areas

You can add an area by adding a new entry to the areas.js file and ensuring that the position defined in the area is complimented by a representative location in the map image. You can use areas.html if you prefer to modify these fields with a GUI interface, though bear in mind any changes made must be exported and applied to areas.js; the project _will not automatically update_.

area.js - Defines location regions and provides credit to artists
- (base array): used to identify a major category or layer (e.g. outdoors, interiors)
    - order: the position of an area screen within the area list. Must be sequential but doesn't need to be ordered.
    - title: Display name for an entry
    - ident: File identity for an entry; should match the file name without the file extension.
    - artist: artist name.
    - artistImageOverride: Name of the artist's avatar filename if the artist name doesn't match it.
    - point: pixel position of the area when displayed. x, y refers to the top-left co-ordinate. width and height are collected automatically from the source image(s).
    - offset: used to define an offset position and size for the redrawn version of an area, allowing for oversized redrawns
    - pan: how the tour camera should pan over the image in tour mode (options: vertical, horizontal )
    - type: 'biome' type of the entry; visually styles the list entry (e.g. Terrace, Castle, Underground, Boss for Castlevania Redrawn)
    - zoom: zoom scale to use when focusing on the area during a tour or when the menu button is clicked.
    - url: URL pointing to the artist's portfolio, social media handle, or link tree
    - post_url: URL of a social media post associated with this entry
 
There are also some fields made for features that are currently not supported:
- teleporters: list of teleporters connected to the area used to 'warp' between locations and / or layers
- animation: indicates whether an animated version of the area is available

## FAQ

__Q: Why are animations not supported?__

_A: Short Answer: The project's backend does not support GIF animation natively and implementing animation is non-trivial. It may also have an undesirable memory overhead.
This redrawn project uses PIXI, which is excellent for static image display and does come with the capability of displaying animation, but any images you wish to have animated must be in separate images, defined individually, then injected into a custom object. The scope of implementing this was larger than the amount of time I wanted to invest in it, but if you would like to investigate and implement this feature into the project you are more than welcome to make a pull request with the solution for this repository. In anticipation of such a solution, Castlevania Redrawn has several animations created by artists for a handful of the screens that you can use for testing purposes._

__Q: Some of the information on this redrawn is out-of-date!__

_A: You can either create a pull request to update the data or reach out to the project's discord._

__Q: Some of the instructions are unclear or could be improved!__

_A: We welcome feedback and want to make this as user friendly as we can! Please create a pull request or reach out on the project's discord._

__Q: What's the project's license?__

_A: The repository is the work of authors Jerky (HyperJerk) and Tyson Moll under Copyright and is provided on GitHub licensed under the GNU General Public License. Other licenses for this software must be negotiated with both authors. This license applies to all derivative works. The artwork is copyright of their respective artists, all rights reserved._
