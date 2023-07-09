export default {
    props: ['start', 'end', 'currentValue'],
    template: `
    <div class="left-content colomn-cont">
        <div class="target-dd inline-cont">
            <span class="value">{{start}}</span>
            <img src="/assets/next.png" class="arrow">
            <span class="value">{{end}}</span>
        </div>
        <div class="current-dd colomn-cont">
            <span class="line">Текущее значение:</span>
            <span class="line value">{{currentValue}}</span>
        </div>
    </div>
    `
}