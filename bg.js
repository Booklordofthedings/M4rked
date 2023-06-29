//Returns the hostname of the active tab
async function GetHostname() {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    var hostname = new URL(tabs[0].url).hostname;
    return hostname;
}

//Changes the state of save
async function ToggleSaveState()
{
    var saveState = await QuerySaveState();
    var hostName = await GetHostname();
    if(saveState) {
        browser.storage.local.set({[hostName]:false});
    }
    else {
        browser.storage.local.set({[hostName]:hostName});
    }
    ChangeIcon(!saveState);
}

//Returns the save state
async function QuerySaveState()
{
    var hostName = await GetHostname();
    var res = await browser.storage.local.get(hostName);
    if(res[hostName] == undefined || res[hostName] == false) {
        return false;
    }
    else {
        return true;
    }
}

//Changes the icon of the extension
async function ChangeIcon(pBool)
{
    if(pBool)
        browser.browserAction.setIcon({path: "icons/icon-32.png"});
    else
        browser.browserAction.setIcon({path: "icons/icon-32-r.png"});
}
function ChangeIconOnQuerySaveState() {
    QuerySaveState().then((res) => {ChangeIcon(res)});
}


browser.browserAction.onClicked.addListener(ToggleSaveState);
browser.tabs.onUpdated.addListener(ChangeIconOnQuerySaveState);
browser.tabs.onActivated.addListener(ChangeIconOnQuerySaveState);
browser.windows.onFocusChanged.addListener(ChangeIconOnQuerySaveState);
ChangeIconOnQuerySaveState();