const add7 = (number) => {
    return parseInt(number) + 7;
}

console.log(add7(5));

const multiply = (number_1, number_2) => {
    return number_1 * number_2;
}

console.log(multiply(5,7));

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log(capitalize('poOkIe'));

function lastletter(str) {
    if (!str) return '';
    var length = str.length;
    return str.charAt(length - 1).toLowerCase();
}

console.log(lastletter('pookie'));