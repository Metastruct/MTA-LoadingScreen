var DEBUG = false;

function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
};
var started = window.performance.timing.navigationStart / 1000;

function Now() {
    var ts = new Date().getTime() / 1000;
    return ts;
};

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}


console.log("Welcome to \n" + window.atob("ICBfXyAgX18gICAgICAgIF8gICAgICAgICAgICBfX19fICAgICAgICAgICAgICAgICAgICBfICAgICAgICAgICAgICAgICAgICAgICBfICAgCiB8ICBcLyAgfCAgX19fIHwgfF8gIF9fIF8gICAvIF9fX3wgX19fICAgXyBfXyAgIF9fXyB8IHxfICBfIF9fICBfICAgXyAgIF9fXyB8IHxfIAogfCB8XC98IHwgLyBfIFx8IF9ffC8gX2AgfCB8IHwgICAgLyBfIFwgfCAnXyBcIC8gX198fCBfX3x8ICdfX3x8IHwgfCB8IC8gX198fCBfX3wKIHwgfCAgfCB8fCAgX18vfCB8X3wgKF98IHwgfCB8X19ffCAoXykgfHwgfCB8IHxcX18gXHwgfF8gfCB8ICAgfCB8X3wgfHwgKF9fIHwgfF8gCiB8X3wgIHxffCBcX19ffCBcX198XF9fLF98ICBcX19fX3xcX19fLyB8X3wgfF98fF9fXy8gXF9ffHxffCAgICBcX18sX3wgXF9fX3wgXF9ffA=="));

function Icon16(path) {
    return {
        'icon16': path,
    }
}

function Color(r, g, b, a) {
    return {
        'r': Math.round(r),
        'g': Math.round(g),
        'b': Math.round(b),
        'a': a || 1
    };
}
WHITE = Color(255, 255, 255)

var firstlog = true;
var toremove = [];

function LogNoRemove() {
    Log.apply(null, arguments);
    return toremove.pop();
};

function Log() {

    if (toremove.length >= 15) {
        var e = toremove.shift();
        //e.fadeOut(1000,function() {
        e.remove();
        //});
    };

    var elem = $("<div>");

    toremove.push(elem);

    var col = Color(255, 255, 255, 255);

    var txt2 = [];
    for (var i = 0; i < arguments.length; i++) {
        var e = arguments[i];
        if (typeof e == "object" && ('r' in e && 'g' in e && 'b' in e)) {
            col = e;
        } else if (typeof e == "object" && ('icon16' in e)) {
            var ico = $("<img>");
            ico.css("display", "inline-block");
            ico.css("width", "16px");
            ico.css("height", "16px");
            ico.css("margin-right", "4px");
            var path = "asset://garrysmod/materials/icon16/" + e['icon16'] + '.png';
            ico.attr('src', path);

            elem.append(ico);
        } else {
            var txt = $("<span>");

            txt.text(e);
            first = false;
            txt.css("color",
                'rgb(' +
                col.r + ", " +
                col.g + ", " +
                col.b +
                ")"
            );

            elem.append(txt);
            txt2.push(e);
        }
    }

    txt2 = txt2.join("");
    console.log(txt2);

    elem.css("padding-left", "1em");
    elem.css("text-indent", "-1em");

    $("#console").append(elem);
    return elem;
}

LogD = Log;



// GMod download queue

var INFO = Color(45, 255, 99);

iDownloading = false;
iFileCount = false;
files_downloaded = 0;

var remaining_elem;
var remaining_logline;

var mdl_cull = ['.vtx', ".dx80.vtx", ".dx90.vtx", '.mdl', '.sw.vtx', '.phy', '.vvd'];
var ext_iconmap = {
    "vmt": "photo_link",
    "vtf": "picture_link",
    "png": "picture_link",
    "jpg": "picture_link",
    "wav": "sound",
    "mp3": "sound",
    "ogg": "sound",
    "mdl": "brick_link",
};

function getExtension(path) {
    var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
        // (supports `\\` and `/` separators)
        pos = basename.lastIndexOf("."); // get last position of `.`

    if (basename === "" || pos < 1) // if file name is empty or ...
        return ""; //  `.` not found (-1) or comes first (0)

    return basename.slice(pos + 1); // extract extension ignoring `.`
}
var prev_dl;
var lastdllog_num;
var lastdllog;

function UpdateDownloading(a) {

    var remaining = iDownloading - files_downloaded;

    if (remaining < -2) {
        if (remaining_elem) {
            remaining_elem.remove();
        } else {
            return;
        }
    }

    if (!remaining_logline) {
        remaining_logline = LogNoRemove(INFO, "Files remaining ", WHITE, remaining);
        remaining_elem = remaining_logline.children().last();
    };

    remaining_elem.text(remaining > 0 && remaining || 0);
    var ext = getExtension(a);
    var str = a.replace(/\//g, " ").replace(/_/g, " ");

    for (var i = mdl_cull.length; i--;) {
        var suffix = mdl_cull[i];
        if (str.endsWith(suffix)) {

            str = str.substring(0, str.length - suffix.length);
            ext = "mdl";
            break;
        };
    };

    if (str == "") {
        console.log("WTF? " + a);
    }
    if (prev_dl == str) {
        if (lastdllog) {
            if (lastdllog_num) {
                lastdllog_num += 1;
                lastdllog.children().last().text(" (" + lastdllog_num + ")");
            } else {
                lastdllog_num = 2;
                lastdllog.append($("<span>").text(" (2)"));
            }
        };
        return;
    }
    prev_dl = str;
    lastdllog_num = false;
    lastdllog = Log(Icon16(ext_iconmap[ext] || "world_go"), " ", str);
};


function OnExtraInfo(data, _, _, same_instance) {
    if (!same_instance) {
        OnServerCrashed();
    };
    OnStats(data.stats);
}

var remaininglua_logline;
var remaininglua_elem;

function OnStatus(a) {

    if (a == "Retrieving Workshop file details...") {
        return;
    };

    if (a == "Deleting Leftovers") {
        return;
    };
    if (a == "Mounting Addons") {
        return;
    };
    if (a == "Workshop Complete") {
        return;
    };
    if (a == "Sending client info...") {
        return;
    };

    if (a == "Client info sent!") {
        return;
    };

    if (a == "Received all Lua files we needed!") {
        return;
    };

    if (a.indexOf("lua files from the server") > 0) {
        return;
    };

    var m = a.match(/Downloaded (\d{1,4}) of (\d{1,4}) Lua files/);
    if (m && m[2]) {

        if (!remaininglua_logline) {
            remaininglua_logline = LogNoRemove(Icon16("script_link"), INFO, "Downloading Lua ", WHITE, m[1], "/", m[2]);
            remaininglua_elem = remaininglua_logline.children().last().prev().prev();
        };

        remaininglua_elem.text(m[1]);

        return;
    };

    var m = a.match(/Loading '(.*)'$/);
    if (m && m[1]) {

        Log(Icon16("plugin"), INFO, "Workshop: ", WHITE, m[1]);

        return;
    };

    Log(a);
};

function DoGmodQueue(entry) {
    var a = entry[1];
    var b = entry[2];
    var c = entry[3];

    switch (entry[0]) {
        case DOWNLOAD_FILES:
            files_downloaded++;
            UpdateDownloading(a);
            break;
        case STATUS_CHANGED:
            OnStatus(a);
            break;
        case FILES_NEEDED:
            if (a != iDownloading) {
                Log(INFO, "Files needed ", WHITE, a, b, c);
            }
            iDownloading = a;
            break;
        case FILES_TOTAL:
            if (a != iFileCount) {
                Log(INFO, "Files total ", WHITE, a, b, c);
            }
            iFileCount = a;
            break;
        default:
            LogD("???", a, b, c);
    }

}

function OnGmodQueue() {
    while (gmod_queue.length > 0) {
        var entry = gmod_queue.pop();
        DoGmodQueue(entry);
    };
};

function OnServerCrashed() {
    Log("Server", Color(255, 22, 20), " CRASHED", Color(255, 2222, 255), ", reconnect manually!");
}

var stats_gotten;
var loadingspeed;
var playerloaddata_finished = false;

function OnStats(stats) {
    if (stats_gotten) {
        return
    };
    stats_gotten = stats;
    DoLoadingBar();
}

var did_loadingbar;

function DoLoadingBar() {
    if (did_loadingbar || !stats_gotten || !playerloaddata_finished) {
        return;
    }
    did_loadingbar = true;

    loadingspeed = loadingspeed || 0;

    var stats = {
        "progress50": stats_gotten['percentile50'],
        "progress99": stats_gotten['percentile99'],
        "progress90": stats_gotten['percentile90'],
    };
    if (loadingspeed) {
        stats["progressYOU"] = loadingspeed;
    } else {
        var a = document.getElementById("progressYOU");
        a.style.display = "none";
    };

    var worst = stats[Object.keys(stats).reduce(function(a, b) {
        return stats[a] > stats[b] ? a : b
    })] + 60;

    $.each(stats, function(elemid, time_taken) {

        var a = document.getElementById(elemid);
        var frac = time_taken / worst;
        a.style.width = (frac * 100) + '%';
        a.style.zIndex = 9999;
        a.innerHTML += fmtMSS(time_taken);
        a.innerHTML = '<span style="position: relative;top: 1em;">' + a.innerHTML + '</span>';
    });

    if (stats["progressYOU"]) {
        var a = document.getElementById("progressYOU");
        a.innerHTML = '<span style="position: relative;top: 1em;">' + a.innerHTML + '</span>';
    };

    var progresssofar = document.getElementById("progresssofar");

    function SetProgressbar() {

        window.requestAnimationFrame(SetProgressbar);


        var seconds = (Now() - started) * (DEBUG ? 15 : 1);

        var m = Math.floor(seconds / 60);
        var s = Math.floor(seconds - m * 60);

        var txt = m + ":" + (s < 10 ? "0" + "" + s : s);

        var frac = seconds / worst;

        frac = frac > 1 ? 1 : (frac < 0 ? 0 : frac);

        progresssofar.style.width = (frac * 100) + '%';
        progresssofar.innerHTML = txt;

    }
    window.requestAnimationFrame(SetProgressbar);

    var a = document.getElementById("progress");
    a.style.display = "initial";
}

function OnPlayerLoadedData(dat) {
    loadingspeed = dat && dat.loadingspeed;
    if (DEBUG) {
        loadingspeed = 60 * 3;
    };

    playerloaddata_finished = true;
    DoLoadingBar();

    if (!dat) {
        Log(Color(255, 100, 20), "First join", WHITE, "? ", Color(100, 255, 20), "Welcome", WHITE, ", traveler!");
    }
}

function LoadPlayerList() {
    var elem;
    var ul;

    var failurl = "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/" +
        "fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

    var serverid = $.urlParam('serverid') || $.urlParam('server') || 3;

    var playersurl = 'https://g2cf.metastruct.net/app/playerlist?server=' + serverid

    var usrinfos = {};

    var first_q = true;

    var last_server = 0;

    var OnPlayerList = function(data, textStatus, request) {
        if (!data) {
            console.log("Unable to load " + playersurl);
            return;
        };
        var first_query = first_q;
        first_q = false;

        if (first_query) {
            last_server = data.started || 0;
        }


        var same_instance = !data.started || data.started == last_server || last_server == 0;
        OnExtraInfo(data, textStatus, request, same_instance);

        var pls = data && data.players;

        if (!elem) {
            var a = LogNoRemove(Color(1, 200, 255), "Players on server: ", Color(255, 255, 255), pls && pls.length);
            elem = a.children().last();
        };


        elem.text(pls.length);

        if (!ul) {
            var tickerw = $('<div id="tickerw">');
            ul = $('<div id="ticker">');
            $("body").append(tickerw);
            tickerw.append(ul);

            var e = tickerw[0];
            var top0 = -500;
            var dir = true;
            var time;

            function pageScroll() {
                // deltatime
                var now = Now();
                var dt = now - (time || now);
                if (dt > 0.1) {
                    dt = 0.1
                };
                time = now;


                if (dir) {
                    var sh = e.scrollHeight;
                    if (top0 > (sh - 256)) {
                        dir = !dir;
                    };
                } else {
                    if (top0 <= -256) {
                        dir = !dir;
                    };
                };


                var x = dt * 100;
                top0 = top0 + (dir && x || -x);
                e.style.top = -Math.floor(top0) + "px";
                requestAnimationFrame(pageScroll);
            }
            pageScroll();


        };

        //ul.empty();

        shuffle(pls);

        Object.keys(usrinfos).forEach(function(userid) {
            var data = usrinfos[userid];
            data.purge = true;
        });

        var maxvisible = 0;

        $.each(pls, function(i, t) {

            var name = t[0];
            var userid = t[1];
            var avatarurl = t[2];

            var prev = usrinfos[userid];
            if (prev) {
                prev.purge = false;

                //TODO: update infos

                return;
            };


            var extrapx = Math.floor(Math.cos(i * 3.1415 * 0.6) * 31);

            var li = $('<div>');
            var div = $('<div class="tickerentry">');
            var img = $('<img class="avatarimg">');
            var txt = $('<div class="tickerentrytxt">');
            div.append(img);
            div.append(txt);
            li.append(div);
            ul.append(li);

            li.data("infos", t);
            li.css("position", 'relative');

            img.attr('src', avatarurl || failurl);
            img.one("error", function() {
                img.attr('src', failurl);
            });

            txt.text(name);

            if (!fullyVisible(div)) {
                maxvisible = maxvisible || (i + 1);

            };

            li.velocity({
                p: {
                    translateX: [extrapx, 150 - extrapx]
                },
                o: {
                    duration: 2900
                }
            });

            if (!first_query) {
                console.log("New " + name);
            }

            usrinfos[userid] = {
                "infos": t,
                "elem": li,
                "purge": false
            };

        });

        Object.keys(usrinfos).forEach(function(userid) {
            var data = usrinfos[userid];
            if (data.purge) {
                delete usrinfos[userid];

                console.log("Purging " + userid + ' - ' + data.infos[0]);

                var we = data.elem;

                var other = ul.children().last();

                we.replaceWith(other);
                we.remove();
            };
        });
    };

    var last_server;

    function RefreshPlayers() {

        $.ajax({
            url: playersurl,
            dataType: "json",
            timeout: 10000,
            success: function(a, b, c) {

                OnPlayerList(a, b, c);

            },
            statusCode: {
                504: function() {
                    Log("Request timeout");
                },
                503: function() {
                    Log("Server down??");
                },
                500: function() {
                    Log("INTERNAL ERROR");
                },
                404: function() {
                    Log("This isnt working");
                }
            },
            error: function(_, e, _) {
                Log("Playerlist failed: " + e);
            }
        }).always(function() {
            setTimeout(RefreshPlayers, 9000);
        });

    };

    RefreshPlayers();
    setInterval(function() {
        //ul.randomize();
    }, 4000);
    window.RefreshPlayers = RefreshPlayers;
};

// helper functions  /////////////////////////////////////////////////////////////////

(function($) {

    $.fn.randomize = function(childElem) {
        return this.each(function() {
            var $this = $(this);
            var elems = $this.children(childElem);

            elems.sort(function() {
                return (Math.round(Math.random()) - 0.5);
            });

            $this.detach(childElem);

            for (var i = 0; i < elems.length; i++)
                $this.append(elems[i]);

        });
    }
})(jQuery);


function fullyVisible(elm) {
    var vpH = $(window).height(),
        st = $(window).scrollTop(),
        y = $(elm).offset().top,
        h = $(elm).height();
    return (y > st && y + h < (vpH + st));
};


// http://stackoverflow.com/a/2450976/3776346
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURIComponent(results[1] || 0);
    }
}


if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = (function() {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ _) {

                window.setTimeout(callback, 1000 / 60);

            };

    })();

}

///////////////////////////////////////////////////////////////

// Images list wiring

if (typeof imageslist !== 'undefined') {

}


// player loading time wiring
(function() {
    var success = false;
    addEventListener("message", function(event) {
        success = true;
        var dat = JSON.parse(event.data);
        OnPlayerLoadedData(dat);
    }, false)

    var iframe = document.createElement('iframe');
    iframe['sandbox'] = 'allow-scripts';
    iframe.style.display = 'none';
    iframe.onload = function() {
        success = true;
        iframe.parentNode.removeChild(iframe);
    };
    iframe.src = "asset://garrysmod/data/loading_screen_data/metastruct_joinspeed2.txt";
    document.body.appendChild(iframe);
    setTimeout(function() {
        setTimeout(function() {
            setTimeout(function() {
                if (!success) {
                    OnPlayerLoadedData(false);
                    iframe.parentNode.removeChild(iframe);
                };
            }, 33);
        }, 33);
    }, 33);
})();


LoadPlayerList();

// check if anything in queue
OnGmodQueue();


$(function() {
    if ((document.location + "").indexOf("changelev") == -1) {
        return;
    }

    var asd = $("<small>");
    asd.text("Changing level...");
    $('<br>').appendTo($("#splashcenter1"));
    asd.appendTo($("#splashcenter1"));
});
