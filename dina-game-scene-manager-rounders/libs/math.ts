

export const distancefromCenterToObject = (innerRadius, outerRadius, circleThickness) => {
    return innerRadius - outerRadius - circleThickness / 2;
}

export const drawCircle = (scene, circleWidth, circleRadius, circleThickness, circleColor) => {
    const circle = scene.add.graphics();
    circle.lineStyle(circleThickness, 0xffffff);
    circle.strokeCircle(circleWidth / 2, circleWidth / 2, circleRadius);
}
export const getGameAngle = (angle) => {
    let gameAngle = angle + 90;
    if (gameAngle < 0) {
        gameAngle = 360 + gameAngle
    }
    return gameAngle;
}
// method to merge intervals, found at
// https://gist.github.com/vrachieru/5649bce26004d8a4682b
export const mergeIntervals = (intervals) => {
    if (intervals.length <= 1) {
        return intervals;
    }
    let stack = [];
    let top = null;
    intervals = intervals.sort(function (a, b) {
        return a[0] - b[0]
    });
    stack.push(intervals[0]);
    for (let i = 1; i < intervals.length; i++) {
        top = stack[stack.length - 1];
        if (top[1] < intervals[i][0]) {
            stack.push(intervals[i]);
        }
        else {
            if (top[1] < intervals[i][1]) {
                top[1] = intervals[i][1];
                stack.pop();
                stack.push(top);
            }
        }
    }
    return stack;
}