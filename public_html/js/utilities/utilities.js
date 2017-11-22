/**
 * Sends a HTTP request for a particular URL, invokes a callback with the contents of the response if it was found.
 * @param {type} url
 * @param {type} callback
 * @returns {undefined}
 */
function requestURL(url, callback)
{
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    };
    request.open("GET", url, true);
    request.send(null);
}

/**
 * Parses a comma-separated-value (CSV) string into an array of objects, and returns the array.
 * @param {String} string
 * @param {String} newlineCharacter
 * @param {String} newElementCharacter
 * @returns {Array}
 */
function parseCSVString(string, newlineCharacter, newElementCharacter) {

    if (newlineCharacter == undefined)
        newlineCharacter = "\n";

    if (newElementCharacter == undefined)
        newElementCharacter = ",";

    // Create an array of samples
    let samples = [];

    // Split the string into lines
    let lines = string.split(newlineCharacter);

    // Create an array of attribute keys
    let keys = [];
    // Iterate through string lines
    for (let lineIndex in lines) {
        let line = lines[lineIndex];
        // If the line is empty, skip it
        if (line == "")
            continue;
        let commaSplit = line.split(";");
        // If this is the first line
        if (lineIndex == 0) {
            // This line contains the attribute keys for the data samples
            for (let commaIndex in commaSplit) {
                let key = commaSplit[commaIndex];
                keys.push(key);
            }
        } else {
            // This line is a sample
            let sample = {};
            // Iterate through values, add them to the sample
            for (let commaIndex in commaSplit) {
                let key = keys[commaIndex];
                let value = commaSplit[commaIndex];
                sample[key] = value;
            }
            // Add the sample to the array of samples
            samples.push(sample);
        }
    }
    return samples;
}

/**
 * Creates a HTML element, appends it to a parent (optional) and set its attributes (optional)
 * @param {String} type
 * @param {Element} parent (Optional)
 * @param {Object} attributes (Optional)
 * @returns {Element}
 */
function createElement(type, parent, attributes) {

    let result = document.createElement(type);

    if (parent)
        parent.appendChild(result);

    if (attributes)
        for (let key in attributes) {
            if (key === "innerHTML")
                result[key] = attributes[key];
            else
                result.setAttribute(key, attributes[key]);
        }

    return result;
}

/**
 * Sets styling properties of a HTML element
 * @param {Element} element
 * @param {Object} properties
 */
function setStyle(element, properties) {
    for (let key in properties) {
        element.style.setProperty(key, properties[key]);
    }
}
