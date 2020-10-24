/* in format * between bits and \n between pairs */
var rawWords = prompt('Enter the raw words');

var pairs = rawWords.split('\n');

var dictionary = {};

pairs.forEach(pair => {
    var parts = pair.split('*');
    var firstPart = parts[0].trimEnd();
    var secondPart = parts[1].trimEnd();
    dictionary[secondPart] = firstPart;
    dictionary[firstPart] = secondPart;
});
function getIndoBoxes() {var indoBoxes =     document.getElementsByClassName('FormattedText notranslate TermText MatchModeQuestionGridTile-text lang-id');    return indoBoxes;}function getEngBoxes() {    var engBoxes =     document.getElementsByClassName('FormattedText notranslate TermText MatchModeQuestionGridTile-text lang-en');    return engBoxes;}function getIndoBoxTitles(indoBoxes) {    var indoTitles = [];    for (var i = 0; i < indoBoxes.length; i ++) {        indoTitles.push(indoBoxes[i].childNodes[0].innerHTML)    }    return indoTitles;}function getEngBoxTitles(engBoxes) {    var engTitles = [];    for (var i = 0; i < engBoxes.length; i ++) {        engTitles.push(engBoxes[i].childNodes[0].innerHTML)    }    return engTitles;}function switchEngBoxTitles(engBoxTitles) {    var engBoxTitleDict = {};    for (var i = 0; i < engBoxTitles.length; i ++) {        engBoxTitleDict[engBoxTitles[i]] = i;    }    return engBoxTitleDict;}function translate(word) {    var translatedWord = dictionary[word];    return translatedWord;}function clickElement(element) {    if (element.fireEvent) {        element.fireEvent("on" + t);    }    else {        let event = document.createEvent("Events");        event.initEvent("pointerdown", true, false), element.dispatchEvent(event);    }}function matchTitles() {    var indoBoxes = getIndoBoxes();    var indoBoxTitles = getIndoBoxTitles(indoBoxes);    var engBoxes = getEngBoxes();    var engBoxTitles = getEngBoxTitles(engBoxes);    var switchedEngBoxTitles = switchEngBoxTitles(engBoxTitles);    for (var i = 0; i < indoBoxTitles.length; i ++) {        var indoBox = indoBoxes[i];        var translatedWord = translate(indoBoxTitles[i]);        var engIndex = switchedEngBoxTitles[translatedWord];        var engBox = engBoxes[engIndex];        clickElement(indoBox);        clickElement(engBox);    }}matchTitles();