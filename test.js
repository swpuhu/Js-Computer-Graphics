function test(arr, unOrderIndex) {
    const unOrderArr = [];
    for (let i = 0; i < unOrderIndex.length; i++) {
        unOrderArr.push(arr[unOrderIndex[i]]);
        arr[unOrderIndex[i]] = undefined;
    }
    const res = [];
    const help = (start) => {
        if (arr.every((item) => item !== undefined)) {
            res.push([...arr]);
            return;
        }
        const first = unOrderIndex[start];
        for (let i = 0; i < unOrderIndex.length; i++) {
            if (arr.indexOf(unOrderArr[i]) > -1) continue;
            arr[first] = unOrderArr[i];
            help(start + 1);
            arr[first] = undefined;
        }
    };
    help(0);
    return res;
}

const res = test([0, 5, 1, 2], [0, 1, 3]);
console.log(res);
