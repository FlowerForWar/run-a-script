/*
This file is part of run-a-script
Copyright (C) 2022-present Mihail Ivanchev

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var reg = null;

async function notify(message) {
    var script = message.script;
    var enabled = message.enabled;

    if (reg) {
        try {
            await reg.unregister();
            reg = null;
        } catch (err) {
            console.log(`Error while unregistering script: ${err}`)
        }
    }

    if (!reg && enabled) {
        var options = {
            "js": [{
                "file": "jquery-3.6.0.min.js"
            }, {
                "code": script
            }],
            "matches": ["http://*/*", "https://*/*"],
            "runAt": "document_start"
        };

        try {
            reg = await browser.userScripts.register(options);
        } catch (err) {
            console.log(`Error while registering script: ${err}`)
        }
    }
}

browser.runtime.onMessage.addListener(notify);

browser.storage.sync.get({
        script: "",
        enabled: false
    })
    .then(val => {
        notify(val)
    })
    .catch(reason => {
        console.log(`Error while retrieving script from storage: ${reason}`)
    });