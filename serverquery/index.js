// Big thankyou to mcapi.ca, planetteamspeak.com & census.daybreakgames.com for maintaining easy to use RESTful APIs

SI = (function Wrapper($) {
    var method = {};
    var minecraft, teamspeak3, planetside2;
    var rate_limit = 30000;
    var log = false;
    //Configuration
    minecraft = JSON.parse(localStorage.getItem('VoodooCraft')) || {
        name: 'VoodooCraft',
        host: 'mc.voodooshipping.net',
        port: '25565'
    };
    teamspeak3 = JSON.parse(localStorage.getItem('Voodoo Shipping Co. Teamspeak')) || {
        name: 'Voodoo Shipping Co. Teamspeak',
        host: 'ts.voodooshipping.net',
        port: '9987',
        icon_id: '499172042', //Requires the server be claimed at planetteamspeak.com
    };
    planetside2 = JSON.parse(localStorage.getItem('Voodoo Company')) || {
        name: 'Voodoo Company',
        alias: 'VCO',
        server: 'Emerald',
        id: '37509488620610014'
    };
    //Helper Functions
    teamspeak3.icon_url = 'https://api.planetteamspeak.com/servericon/' + teamspeak3.host + ((teamspeak3.port) ? ':' + teamspeak3.port : '') + '?img=true&id=' + teamspeak3.icon_id;
    minecraft.icon_url = 'https://mcapi.ca/query/' + minecraft.host + ((minecraft.port) ? ':' + minecraft.port : '') + '/icon'
    
    function storeValue(thisArg) { //Stores the values so new data will not be fetched on refresh
        localStorage.setItem(thisArg.name, JSON.stringify(thisArg, function(k, v) {
            if(k === 'listeners') {
                return undefined;
            }else {
                return v;
            }
        }));
        if(log) {
            console.info('Value Stored for ' + thisArg.name);
        }
    }

    function updateListeners(thisArg) { //Calls all the listeners (in the order they were added)
        thisArg.listeners = thisArg.listeners || [];
        thisArg.listeners.forEach(function(fn) {
            fn(thisArg);
        });
        if(log) {
            console.info('Listeners for ' + thisArg.name + ' have been called')
        }
    }

    function registerListener(thisArg, callback) { //Adds listeners for the current view
        thisArg.listeners = thisArg.listeners || [];
        if(typeof callback == 'function' && thisArg.listeners.indexOf(callback) == -1) {
            thisArg.listeners.push(callback);
        }
    }

    function checkRate(thisArg) { //Returns true if new data can be requested
        var status = !(thisArg.updated && Date.now() < thisArg.updated + rate_limit)
        if(!status) {
            if(log) {
                console.warn('New data for ' + thisArg.name + ' can only be requested in ' + Math.round((thisArg.updated + rate_limit - Date.now()) / 1000) + 's');
            }
            updateListeners(thisArg);
        }
        return status
    }

    minecraft.get = function() {
        var mc = this;
        if(checkRate(mc)) {
            $.getJSON('https://mcapi.ca/query/' + mc.host + ((mc.port) ? ':' + mc.port : '') + '/info', function(json) {
                if(json.status){
                    mc.updated = Date.now();
                    mc.users = {};
                    mc.users.online = json.players.online;
                    mc.users.max = json.players.max;
                    mc.version = json.version;
                    mc.ping = json.ping;
                    mc.motd = json.motd;

                    updateListeners(mc);
                    storeValue(mc);
                }else {
                    mc.updated = false;
                    console.error(json);
                }
            })
        };
        return minecraft;
        }

    planetside2.get = function() {
        var ps2 = this;
        if(checkRate(ps2)) {
            $.getJSON('https://census.daybreakgames.com/s:cyanawesome/get/ps2:v2/outfit_member?outfit_id=' + ps2.id + '&c:show=character_id&c:resolve=online_status&c:limit=2000&callback=?', function(json) {
                if(json.returned > 0){
                    ps2.updated = Date.now();
                    ps2.users = {};
                    ps2.users.total = json.returned;
                    ps2.users.online = 0;
                    for(i=0; i<json.outfit_member_list.length; i++) {
                        if(json.outfit_member_list[i].online_status > 0) {
                            ++planetside2.users.online;
                        }
                    }
                    updateListeners(ps2);
                    storeValue(ps2);
                }
                if(json.error) {
                    planetside2.updated = false;
                    console.error(json.error);
                }
            });
        }
        return planetside2;
    }

    teamspeak3.get = function() {
        var ts3 = this;
        if(checkRate(ts3)) {
            $.getJSON('https://api.planetteamspeak.com/serverstatus/' + ts3.host + ((ts3.port) ? ':' + ts3.port : ''), function(json) {
                if(json.status = "success"){
                    ts3.updated = Date.now();
                    ts3.users = json.result.users;
                    ts3.slots = json.result.slots;
                    ts3.country = json.result.country;
                    if(!teamspeak3.version) {
                        $.getJSON('https://api.planetteamspeak.com/updatecheck/' + ts3.host + ((ts3.port) ? ':' + ts3.port : ''), function(json) {
                            if(json.status = "success"){
                                ts3.version = json.result.serverver;
                            }
                        });
                    }
                    updateListeners(ts3);
                    storeValue(ts3);
                }else {
                    ts3.updated = false;
                    console.error(json);
                }
            });
        }
        return teamspeak3;
    }

    //Initial Fetch
    minecraft.get();
    planetside2.get();
    teamspeak3.get();

    method.register = function(type, callback) {
        switch(type) {
            case 'minecraft':
                registerListener(minecraft, callback);
                break;
            case 'planetside2':
                registerListener(planetside2, callback);
                break;
            case 'teamspeak3':
                registerListener(teamspeak3, callback);
                break;
        }
        return true;
    };
    method.get = function(type) {
        switch(type) {
            case 'minecraft':
                return minecraft.get();
            case 'planetside2':
                return planetside2.get();
            case 'teamspeak3':
                return teamspeak3.get();
            case undefined:
                return {
                    minecraft: minecraft.get(),
                    planetside2: planetside2.get(),
                    teamspeak3: teamspeak3.get()
                }
        }
    }
    method.reset = function() {
        localStorage.removeItem('VoodooCraft');
        localStorage.removeItem('Voodoo Shipping Co. Teamspeak');
        localStorage.removeItem('Voodoo Company')
        return Wrapper($);
    }
    return method;
})(jQuery);



$(document).ready(function() {
    function mcTable(data) {
        $('#mc_data').html(JSON.stringify(data, function(k, v) {
            if(k === 'listeners') {
                return undefined;
            }else {
             
                return v;
            }
        }));
        $('#mc_name').html(data.name);
        $('#mc_motd').html(data.motd);
        $('#mc_version').html(data.version);
        $('#mc_ping').html(data.ping);
        $('#mc_host').html(data.host);
        $('#mc_port').html(data.port);
        $('#mc_online').html(data.users.online);
        $('#mc_max').html(data.users.max);
        $('#mc_update').html(new Date(data.updated).toUTCString());
    }
    function ts3Table(data) {
        $('#ts3_data').html(JSON.stringify(data, function(k, v) {
            if(k === 'listeners') {
                return undefined;
            }else {
                return v;
            }
        }));
        $('#ts3_name').html(data.name);
        $('#ts3_version').html(data.version);
        $('#ts3_host').html(data.host);
        $('#ts3_port').html(data.port);
        $('#ts3_users').html(data.users);
        $('#ts3_slots').html(data.slots);
        $('#ts3_update').html(new Date(data.updated).toUTCString());
    }
    function ps2Table(data) {
        $('#ps2_data').html(JSON.stringify(data, function(k, v) {
            if(k === 'listeners') {
                return undefined;
            }else {
                return v;
            }
        }));
        $('#ps2_name').html(data.name);
        $('#ps2_alias').html(data.alias);
        $('#ps2_server').html(data.server);
        $('#ps2_online').html(data.users.online);
        $('#ps2_total').html(data.users.total);
        $('#ps2_id').html(data.id);
        $('#ps2_server').html(data.server);
        $('#ps2_update').html(new Date(data.updated).toUTCString());
    }
    SI.register('minecraft', mcTable);
    SI.register('teamspeak3', ts3Table);
    SI.register('planetside2', ps2Table);
    SI.get();
    setInterval(function() {
        SI.get()
    }, 60000);
});