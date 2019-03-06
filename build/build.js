const fs = require('fs');
const path = require('path');

const itemType = {
    box: 'box',
    model: 'model',
    text: 'text',
    img: 'img',
};

const spec = {
    name: '',
    markerValue: '',
    itemType: itemType.model,
    src: '',
    rotation: '',
    position: '',
    color: '',
    text: '',
};

const db = [
    {
        name: 'inner_qr',
        markerValue: '0',
        itemType: itemType.img,
        src: 'cam01/markers/1.png',
    },
];

const layoutTemplate = fs.readFileSync(
    path.join(__dirname, 'layout.html'),
    'utf8'
);
const baseUrl = 'https://supersecretagent1.github.io/cam01/';

const modelToHtml = (model) => {
    let content = '';

    switch (model.itemType) {
        case itemType.box:
            content = `
            <a-marker type='barcode' value='${model.markerValue}'>
                <a-box position='${model.position ||
                    ''}' rotation="${model.rotation ||
                ''}" material='color: ${model.color ||
                'yellow'}; opacity: 0.5'></a-box>
            </a-marker>`;
            break;
        case itemType.text:
            content = `
            <a-marker type='barcode' value='${model.markerValue}'>
                <a-text value="${model.text}" rotation="${model.rotation ||
                '-90 0 0'}" position="${model.position ||
                ''}" color="red"></a-text>
            </a-marker>`;
            break;
        case itemType.img:
            content = `
            <a-marker type='barcode' value='${model.markerValue}'>
                <a-image src="${model.src}" rotation="${model.rotation ||
                '-90 0 0'}" position="${model.position || ''}"></a-image>
            </a-marker>`;
            break;
        case itemType.model:
            content = `
            <a-assets>
                <a-asset-item id="${model.name}" src="${
                model.src
            }"></a-asset-item>
            </a-assets>
            <a-marker type='barcode' value='${model.markerValue}'>
                <a-entity gltf-model="#${
                    model.name
                }" rotation="${model.rotation ||
                ''}" position="${model.position ||
                ''}" modify-materials></a-entity>
            </a-marker>`;
            break;
    }

    return content;
};

const buildPage = (model) => {
    const content = modelToHtml(model);

    fs.writeFileSync(
        path.join(__dirname, '..', `${model.name}.html`),
        layoutTemplate.replace('{{content}}', content)
    );
};

const buildMapPage = () => {
    let content = `
    <h2 style="margin: 20px;"><a href="${baseUrl}">index</a></h2>
    <h2 style="margin: 20px;"><a href="${baseUrl +
        'number_detector.html'}">number detector</a></h2>
    `;

    for (const model of db) {
        content += `<h2 style="margin: 20px;"><a href="${baseUrl +
            model.name}.html">${model.name}</a></h2>`;
    }

    for (let i = 0; i <= 63; i++) {
        content += `<h2 style="margin: 20px;"><a href="${baseUrl +
            i}.html">${i}</a></h2>`;
    }

    fs.writeFileSync(path.join(__dirname, '..', `links.html`), content);
};

const buildTestPages = () => {
    for (let i = 0; i <= 63; i++) {
        const colors = ['red', 'green', 'blue'];
        buildPage({
            name: i,
            markerValue: i,
            itemType: itemType.box,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }
};

const buildDetectionPage = () => {
    let content = '';
    for (let i = 0; i <= 63; i++) {
        content += modelToHtml({
            name: i,
            markerValue: i,
            itemType: itemType.text,
            text: i,
        });
    }

    fs.writeFileSync(
        path.join(__dirname, '..', `number_detector.html`),
        layoutTemplate.replace('{{content}}', content)
    );
};

const buildQuestPages = () => {
    for (const model of db) {
        buildPage(model);
    }
};

// buildTestPages();
// buildDetectionPage();
buildQuestPages();
buildMapPage();
