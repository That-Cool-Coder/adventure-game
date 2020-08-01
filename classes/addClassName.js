// If the class name list exists, then push to it
// Else create a new list

function addClassName(obj, className) {
    if (obj.classNames !== undefined) {
        obj.classNames.push(className);
    }
    else {
        obj.classNames = [className];
    }
}