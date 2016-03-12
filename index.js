/** Width of the thumbnails, in pixels. **/
imgWidth  = 341;

/** Height of the thumbnails, in pixels. **/
imgHeight = 256;

/** Left edge of sub region to extract from display, in pixels. **/
//imgX0     = 23;

/** Top edge of sub region to extract from display, in pixels. **/
//imgY0     = 42;

/** Right edge of sub region to extract from display, in pixels. **/
//imgX1     = imgX0 + 800;

/** Bottom edge of sub region to extract from display, in pixels. **/
//imgY1     = imgY0 + 666;

/** Timeout is used to store the timer for the next thumbnail refresh. **/
timeout   = null;

/**
 * Dispays an error message.
 * @param  message  Error message to display
 */
function error(message) {
	document.getElementById('loading').style.display = 'none';
	var div = document.createElement('div');
	div.className = 'error';
	div.appendChild(document.createTextNode(message));
	document.body.appendChild(div);
}

/**
 * Triggered when the page loads.
 */
function onload() {
	// Use AJAX to communicate with the MOB
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		// Wait until the document is done
        if (xhttp.readyState != 4 || xhttp.status != 200) {
            return;
        }

        // Look for the list of child entities
        var str = xhttp.responseText;
        var loc = str.indexOf('<td class="c2">childEntity</td>');
        if (loc == -1) {
            error('Could not find child entities!');
            return;
        }
        str = str.substring(loc);
        loc = str.indexOf('<table ');
        if (loc == -1) {
            error('Could not locate start of table!');
            return;
        }
        str = str.substring(loc);
        loc = str.indexOf('</table>');
        if (loc == -1) {
            error('Could not locate end of table!');
            return;
        }
        str = str.substring(0, loc);

        // Look for the first VM
        loc = str.indexOf('<a href="/');
        while (loc != -1) {
        	// Extract the VM information (moid and name)
			loc = str.indexOf('>', loc + 1);
			if (loc == -1) {
				error('Could not locate beginning of moid!');
				return;
			}
			loc++;
			var loc2 = str.indexOf('<', loc + 2);
			if (loc2 == -1) {
				error('Could not locate end of moid!');
				return;
			}
			var moid = str.substring(loc, loc2);
			loc = str.indexOf(' (', loc2 + 4);
			if (loc == -1) {
				error('Could not locate beginning of VM name!');
				return;
			}
			loc += 2;
			loc2 = str.indexOf('</td>', loc + 3);
			if (loc2 == -1) {
				error('Could not locate end of VM name!');
				return;
			}
			loc2 -= 1;
			var name = str.substring(loc, loc2);
	
			// Create and append the thumbnail to the document
			var figure = document.createElement('figure');
			figure.id = 'figure-' + moid;
			var img = document.createElement('img');
			var src = '/screen?id=' + moid;
			// Specify the width and height of the image
			if (typeof imgHeight != 'undefined') {
				src += '&h=' + imgHeight;
				img.height = imgHeight;
			}
			if (typeof imgWidth != 'undefined') {
				src += '&w=' + imgWidth;
				img.width = imgWidth;
			}
			// If we want a sub region, add those parameters
			if (typeof imgX0 != 'undefined')  src += '&x0=' + imgX0;
			if (typeof imgY0 != 'undefined')  src += '&y0=' + imgY0;
			if (typeof imgX1 != 'undefined')  src += '&x1=' + imgX1;
			if (typeof imgY1 != 'undefined')  src += '&y1=' + imgY1;
			img.src = src + '&t=0';
			$(img).bind({
				load: function() {
					// Reset our timeout so all images refresh 7.5s after the last one loads
					if (timeout != null) {
						window.clearTimeout(timeout);
					}
					timeout = window.setTimeout(refreshAll, 7500);
				},
				error: function() {
					// If the VM is not running or has no thumbnail, remove it
					$(this.parentElement).remove();
				}
			});
			figure.appendChild(img);
			var figcaption = document.createElement('figcaption');
			figcaption.appendChild(document.createTextNode(name));
			figure.appendChild(figcaption);
			document.body.appendChild(figure);
	
			// Look for the next VM
			loc = str.indexOf('<a href="/', loc2 + 4);
		}

        // Hide the 'Loading...' text
        document.getElementById('loading').style.display = 'none';
	};
	xhttp.open('GET', '/mob/?moid=ha-folder-vm', true);
	xhttp.send();
}

/**
 * Refreshes all of the thumbnails.
 */
function refreshAll() {
    var t = (new Date()).getTime();
    $('img').each(function() {
        this.src = this.src.substring(0, this.src.lastIndexOf('&t=')) + '&t=' + t;
    });
}
