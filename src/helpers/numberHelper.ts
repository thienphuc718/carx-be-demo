export function formatCurrency(value: number): string {
    // return 0 if number = 0
    if (value === 0) {
        return '0';
    }

    // remove sign if negative
    var sign = 1;
    if (value < 0) {
        sign = -1;
        value = -value;
    }
    // trim the number decimal point if it exists
    let num = value.toString().includes('.') ? value.toString().split('.')[0] : value.toString();
    let len = num.toString().length;
    let result = '';
    let count = 1;

    for (let i = len - 1; i >= 0; i--) {
        result = num.toString()[i] + result;
        if (count % 3 === 0 && count !== 0 && i !== 0) {
            result = ',' + result;
        }
        count++;
    }

    // add number after decimal point
    if (value.toString().includes('.')) {
        result = result + '.' + value.toString().split('.')[1];
    }
    // return result with - sign if negative
    return sign < 0 ? '-' + result : result;
}