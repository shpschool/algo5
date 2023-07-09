export default {
    data() {return },
    props: ['title'],
    watch: {
        title() {
            document.title = this.title;
        },
    },
    template: `
    <div class="header colomn-cont">
        <div class="header-wrap inline-cont">
            <span class="left-content colomn-cont">
                <img src="/assets/logo.png" class="logo">
            </span>
            <h1 class="right-content">ИСПОЛНИТЕЛЬ {{title.toUpperCase()}}</h1>
        </div>
    </div>
    `
}