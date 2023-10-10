/*
*   Retro Redrawn 
*   -- Area Editor JavaScript
*
*   Editor tool for creating new areas and modifying existing ones.
*   Uses Implementation script for data related to a particular implementation.
*
*   Originally written by Jerky.
*   Refactored for reuse by Tyson Moll (vvvvvvv), 2023.
*
*/


var selectedArea = null
var elems = null
var layerCount = redrawnLayers.length;  // Total number of layers
var regionAreas = []; // Stores region area & associated CSS ID

// Template for an area
var blankArea = {
    title: "New",
    ident: "",
    artist: "",
    artistImageOverride: "",
    url: "",
    post_url: "",
    animation: false,
    point: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    pan: "vertical",
    type: "town",
    zoom: 2,
    teleporters: []
}

document.addEventListener('DOMContentLoaded', init) // Run init when DOM has loaded.

/** Initializes the Area Editor. 
 */
function init () {
    registerElems();
    createRegionMenus();
    populateAreaTypes();
    setEventOnStaticInputs();
    updateAreaLists();
    selectArea(regionAreas[0][0][0]);   // Designate a starting area
}

/** Prevents the Form Submit action from performing its default behaviour. (Override)
 * 
 * @param {*} e 
 */
function formSubmit (e) {
    e.preventDefault()
}

/** ... */
function setEventOnStaticInputs () {
    var elems = document.querySelectorAll('input, select')
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        elem.addEventListener('change', saveData);
    }
}

/** 
 * Registers elements for the area entry form.
*/
function registerElems () {
    elems = {
        order: document.querySelector('#areaForm [name="order"]'),
        title: document.querySelector('#areaForm [name="title"]'),
        ident: document.querySelector('#areaForm [name="ident"]'),
        type: document.querySelector('#areaForm [name="type"]'),
        artist: document.querySelector('#areaForm [name="artist"]'),
        artistImageOverride: document.querySelector('#areaForm [name="artistImageOverride"]'),
        url: document.querySelector('#areaForm [name="url"]'),
        post_url: document.querySelector('#areaForm [name="post_url"]'),
        point_x: document.querySelector('#areaForm [name="point_x"]'),
        point_y: document.querySelector('#areaForm [name="point_y"]'),
        offset_box_x: document.querySelector('#areaForm [name="offset_box_x"]'),
        offset_box_y: document.querySelector('#areaForm [name="offset_box_y"]'),
        offset_box_width: document.querySelector('#areaForm [name="offset_box_width"]'),
        offset_box_height: document.querySelector('#areaForm [name="offset_box_height"]'),
        pan: document.querySelector('#areaForm [name="pan"]'),
        zoom: document.querySelector('#areaForm [name="zoom"]'),

        regionMenu: document.getElementById('regionMenu')
    }
}

/** Prepares menus for each region in the DOM. */
function createRegionMenus() {

    regionAreas = [];   // Clear (in case populated)

    for (var i=0; i < layerCount; i++)
    {
        regionAreas.push([redrawnlayers[i].areas, `AreaList${redrawnLayers[i].name}`])

        let html = `
        <h4>${redrawnLayers[i].name} Areas</h4>
        <ul id="${regionAreas[i][1]}">
        </ul>
        <button onclick="addRegionArea(${i})">Add</button>
        `

        regionMenu.innerHTML += html;
    }
}

/** Populates the area type option dropdown. */
function populateAreaTypes() {

    for (var i=0; i< biomes.length; i++) {
        let html = `<option value="${biomes[i].ident}" `
        if (i == 0) {
            html += `selected`
        }
        html += `>${biomes[i].name}</option>`
        elems.type.innerHTML += html;
    }
}

/** Updates each defined region area */
function updateAreaLists () {
    regionAreas.forEach(element => {
        generateRegionList(element[0], element[1])
    });
}

/** Generates a region's area list */
function generateRegionList (areas, cssId) {
    areas.sort((a, b) => a.order - b.order)
    var listHTML = []
    for (var i = 0; i < areas.length; i++) {
        area = areas[i]
        let className =  selectedArea && selectedArea.ident === area.ident ? 'selected' : !area.artist ? 'warning' : ''
        listHTML.push(`
            <li>
                <button onclick="clickArea('${area.ident}')" data-ident="${area.ident}" class="${className}">
                    <span>${area.title}</span>
                </button>
            </li>
        `)
    }
    var listElem = document.querySelector(`#${cssId}`)
    if (listElem != null) {
        if (listHTML.length > 0) {
            listElem.innerHTML = listHTML.join('');
        }
        else
        {
            let report = `Region with cssId ${cssId} did not have areas!`;
            console.warn(report);
        }
    }
    else
    {
        let report = `Couldn't find cssId ${cssId} element!`;
        console.error(report)
    }
    
}

/** DOM button click response for when an area is clicked. */
function clickArea (ident) {
    selectArea(getAreaByIdent(ident))
}

/** Sets the argument-defined area as the new selected area and updates the display. */
function selectArea (area) {
    selectedArea = area
    loadSelectedAreaDataIntoElements()
    updateSelectedArea()
    updateAreaLists()
}

/** Fetches an area using an ident key. */
function getAreaByIdent (ident) {
    var area = null
    if (regionAreas.length < 1)
        return;
    for (var i = 0; i< regionAreas.length; i++) {
        area = regionAreas[i][0].find(x => x.ident === ident)
        if (area) { return area }
    }
}

/** Updates the selected area (but really just updates its teleporter info). */
function updateSelectedArea () {
    if (selectedArea) {
        generateTeleporterList()
    }
}

/** Updates the selected area's file identifier to a tech-safe value. */
function updateSelectedAreaIdent () {
    if (selectedArea) {
        if (!selectedArea.ident) {
            selectedArea.ident = toSnakeCase(elems.title.value)
            elems.ident.value = selectedArea.ident
        }
    }
}

/** Loads data from the selected area into the editor's DOM fields. */
function loadSelectedAreaDataIntoElements () {
    if (selectedArea) {
        elems.order.value = selectedArea.order || null
        elems.title.value = selectedArea.title || null
        elems.ident.value = selectedArea.ident || null
        elems.type.value = selectedArea.type || null
        elems.artist.value = selectedArea.artist || null
        elems.artistImageOverride.value = selectedArea.artistImageOverride || null
        elems.url.value = selectedArea.url || null
        elems.post_url.value = selectedArea.post_url || null
        elems.point_x.value = selectedArea.point.x || null
        elems.point_y.value = selectedArea.point.y || null
        elems.offset_box_x.value = selectedArea.offset.x || null
        elems.offset_box_y.value = selectedArea.offset.y || null
        elems.offset_box_width.value = selectedArea.offset.width || null
        elems.offset_box_height.value = selectedArea.offset.height || null
        elems.pan.value = selectedArea.pan || null
        elems.zoom.value = selectedArea.zoom || null
    }
}

/** Saves editor's DOM field values to the selected area and refreshes the area list.  */
function saveData () {
    if (selectedArea) {
        selectedArea.order = parseInt(elems.order.value)
        selectedArea.title = elems.title.value
        selectedArea.ident = elems.ident.value
        selectedArea.type = elems.type.value
        selectedArea.artist = elems.artist.value
        selectedArea.artistImageOverride = elems.artistImageOverride.value
        selectedArea.url = elems.url.value
        selectedArea.post_url = elems.post_url.value
        selectedArea.point.x = parseInt(elems.point_x.value)
        selectedArea.point.y = parseInt(elems.point_y.value)
        selectedArea.offset.x = parseInt(elems.offset_box_x.value)
        selectedArea.offset.y = parseInt(elems.offset_box_y.value)
        selectedArea.offset.width = parseInt(elems.offset_box_width.value)
        selectedArea.offset.height = parseInt(elems.offset_box_height.value)
        selectedArea.pan = elems.pan.value
        selectedArea.zoom = parseInt(elems.zoom.value)

        // Teleporters
        var teleporters = []
        var teleporterElems = document.querySelectorAll('#teleporters li')
        for (var i = 0; i < teleporterElems.length; i++) {
            var elem = teleporterElems[i]
            teleporters.push({
                ident: elem.querySelector(`[name="tele_${i}_ident"]`).value,
                x: elem.querySelector(`[name="tele_${i}_box_x"]`).value,
                y: elem.querySelector(`[name="tele_${i}_box_y"]`).value,
                width: elem.querySelector(`[name="tele_${i}_box_width"]`).value,
                height: elem.querySelector(`[name="tele_${i}_box_height"]`).value
            })
        }
        selectedArea.teleporters = teleporters

        updateAreaLists()
    }
}

/** Updates the teleportation tool's DOM element position values */
function updateTeleporterTranslateTool () {
    var xElem = document.querySelector('#TeleporterXTranslate')
    var xOutputElem = document.querySelector('#TeleporterXTranslateOutput')
    var x = parseInt(xElem.value)
    var yElem = document.querySelector('#TeleporterYTranslate')
    var yOutputElem = document.querySelector('#TeleporterYTranslateOutput')
    var y = parseInt(yElem.value)

    if (selectedArea) {
        xOutputElem.value = (selectedArea.point.x + selectedArea.offset.x) - x
        yOutputElem.value = (selectedArea.point.y + selectedArea.offset.y) - y
    }

}

/** Generates a list of teleporters for the selected area. */
function generateTeleporterList () {
    if (selectedArea) {
        var list = document.querySelector('#teleporters')
        if (list) {
            var towrite = ''
            for (var i = 0; i < selectedArea.teleporters.length; i++) {
                var teleporter = selectedArea.teleporters[i]
                towrite += `<li data-index="${i}">
                    <button onclick="removeTeleporter(${i})">Remove</button>
                    <label><span></span>Target Ident
                        <input name="tele_${i}_ident" placeholder="e.g. viridian_gym" value="${teleporter.ident}" onchange="saveData()" />
                    </label>
                    <div>
                        <label><span>x</span><input name="tele_${i}_box_x" type="number" value="${teleporter.x}" onchange="saveData()"></label>
                        <label><span>y</span><input name="tele_${i}_box_y" type="number" value="${teleporter.y}" onchange="saveData()"></label>
                        <label><span>width</span><input name="tele_${i}_box_width" type="number" value="${teleporter.width}" onchange="saveData()"></label>
                        <label><span>height</span><input name="tele_${i}_box_height" type="number" value="${teleporter.height}" onchange="saveData()"></label>
                    </div>
                </li>`
            }
            list.innerHTML = towrite
        }
    }
}

/** Adds a teleporter to the selected area. */
function addTeleporter () {
    if (selectedArea) {
        selectedArea.teleporters.push({
            ident: '',
            x: 0,
            y: 0,
            width: 0,
            height: 0
        })
        generateTeleporterList()
    }
    
}

/** Removes a teleporter from the selected area. */
function removeTeleporter (index) {
    if (selectedArea) {
        selectedArea.teleporters.splice(index, 1)
        generateTeleporterList()
    }
}

/** Removes the actively selected area. */
function removeArea () {
    if (selectedArea) {
        for (var i=0; i<layerCount; i++) 
        {
            var index = redrawnlayers[i].areas.findIndex(x => x.ident === selectedArea.ident)
            if (index > -1) 
            {
                regionAreas[i].splice(index, 1);
                generateRegionList(index, regionAreas[i][1]);
            }
        }
        selectArea(regionAreas[0][0][0])
    }
}

/** Adds an area to an indexed region in variable regionAreas. Called by DOM. */
function addRegionArea (regionIndex) {
    selectedArea = null
    let regionArea = regionAreas[regionIndex];
    regionArea[0].push(JSON.parse(JSON.stringify({...blankArea, order: regionArea[0].length})))
    // clearElems()
    generateRegionList(regionArea[0], regionArea[1])   // Regenerate 
                                            // TODO: make this regenerate just the modified list?
    selectArea(regionArea[0][regionArea[0].length - 1])   // Select added area
}

/** Prepares a JSON output of the region areas. */
function doOutput () {
    var elem = document.querySelector('#output')
    if (elem) {
        var areas = ''
        for (var i=0; i<regionAreas.length; i++) {
            areas +=  `var ${redrawnLayers[i].name} = ${JSON.stringify(regionAreas[i][0], null, 2)} \n`
        }
        elem.value = areas.replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, function (match) {
            return match.replace(/"/g, "").replace("'", '’');
        });
    }
}

/** Helper: Converts a string to snake_case */
function toSnakeCase (string) {
    var str = string || ''
    var strArr = str.split(' ');
    var snakeArr = strArr.reduce((acc, val) => {
        return acc.concat(val.toLowerCase());
    }, []);
    return snakeArr.join('_');
}
    