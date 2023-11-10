

// Querying the relevant tabs

const tabs = await chrome.tabs.query({
    url : [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*"
    ]
});


// Collator object to help sort the tab list alphabetically.

const collator = new Intl.Collator();

tabs.sort((a,b) => collator.compare(a.title, b.title));


// Our hidden HTML code in the popup.html file

const template = document.getElementById("li_template");


// Keep in mind, every tab in tabs is a relevant tab, because we specifically queried only the tabs that are relevant.

const elements = new Set();

for (const tab of tabs) {

    // Here, we are creating an HTML element (a list item, to be more specific) that represents each relevant tab to be displayed in the popup.

    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();

    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    // So far, the element seems to be an HTML element that is a direct clone of the li node, in other words, the first child element of the template node itself.

    element.querySelector(".title").textContent = title;

    element.querySelector(".pathname").textContent = pathname;

    element.querySelector("a").addEventListener("click", async () => {
        
        // Need to focus window as well as the active tab

        await chrome.tabs.update(tab.id, {active : true});
        await chrome.windows.update(tab.windowId, {focused : true});

    });

    elements.add(element);

}

// At this point all the relevant HTML elements are ready and stored in the elements set.

document.querySelector("ul").append(...elements);



// Button for grouping tabs together and moving them into the current window.

const button = document.querySelector("button");

button.addEventListener("click", async() => {

    const tabIds = tabs.map(({id}) => id);

    const group = await chrome.tabs.group({tabIds});

    await chrome.tabGroups.update(group, {title:"DOCS"});



})